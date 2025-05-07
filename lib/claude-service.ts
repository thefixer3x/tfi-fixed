import { supabase } from './supabase';
import { ClaudeResponse } from '@/types/chat';

/**
 * Type definition for message objects sent to the Claude API
 */
export type MessageType = {
  role: 'user' | 'assistant';
  content: string;
};

/**
 * Send a message to Claude API via Supabase Edge Function
 * @param conversationId - The ID of the current conversation
 * @param messages - Array of messages to send to Claude
 * @param model - Claude model to use (defaults to claude-3-sonnet)
 * @returns Promise with Claude's response
 */
export async function sendMessageToClaudeAPI(
  conversationId: string,
  messages: MessageType[],
  model: string = 'claude-3-sonnet-20240229'
): Promise<ClaudeResponse> {
  // Get user session for authentication
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    throw new Error(`Authentication error: ${sessionError.message}`);
  }
  
  if (!sessionData.session) {
    throw new Error('No active session');
  }
  
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  
  if (!apiBaseUrl) {
    throw new Error('API base URL not configured');
  }
  
  try {
    // Call the Supabase Edge Function
    const response = await fetch(`${apiBaseUrl}/claude`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionData.session.access_token}`,
      },
      body: JSON.stringify({
        conversation_id: conversationId,
        messages,
        model,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API error (${response.status}): ${errorData}`);
    }
    
    const data = await response.json();
    return data as ClaudeResponse;
  } catch (error) {
    console.error('Error sending message to Claude:', error);
    throw error;
  }
}

/**
 * Helper function to prepare messages for the Claude API
 * @param messages - Array of messages to format
 * @returns Formatted messages for Claude API
 */
export function prepareMessagesForClaudeAPI(
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>
): MessageType[] {
  // Remove any consecutive assistant messages (keep only the last one)
  const filteredMessages: MessageType[] = [];
  
  for (let i = 0; i < messages.length; i++) {
    // Skip assistant messages that are followed by another assistant message
    if (
      messages[i].role === 'assistant' &&
      i + 1 < messages.length &&
      messages[i + 1].role === 'assistant'
    ) {
      continue;
    }
    
    filteredMessages.push({
      role: messages[i].role,
      content: messages[i].content,
    });
  }
  
  // Claude has a context window limit, so we might need to truncate
  // For now, just return the last 20 messages to be safe
  // This could be improved with token counting
  if (filteredMessages.length > 20) {
    return filteredMessages.slice(filteredMessages.length - 20);
  }
  
  return filteredMessages;
}

/**
 * Helper function to process Claude's response if needed
 * @param response - Response from Claude API
 * @returns Processed message content
 */
export function processClaudeResponse(response: ClaudeResponse): string {
  // Here we could process the response if needed
  return response.message;
}

