/**
 * Type definitions for chat-related interfaces
 */

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
};

export type Conversation = {
  id: string;
  title: string;
  createdAt: number;
};

export type User = {
  id: string;
  email: string;
};

export type ClaudeResponse = {
  message: string;
  model: string;
  id: string;
};

