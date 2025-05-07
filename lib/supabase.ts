import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database
export type DBConversation = {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
};

export type DBMessage = {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
};

/**
 * Authentication Functions
 */

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error getting current user:', error);
  }
  
  return { user: data.user, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
};

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Error signing out:', error);
  }
  
  return { error };
};

/**
 * Conversation Functions
 */

export const getConversations = async () => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user?.user) {
      return { data: null, error: new Error('Not authenticated') };
    }
    
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching conversations:', error);
    }
    
    return { data, error };
  } catch (error) {
    console.error('Unexpected error in getConversations:', error);
    return { data: null, error };
  }
};

export const getConversation = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching conversation ${id}:`, error);
    }
    
    return { data, error };
  } catch (error) {
    console.error('Unexpected error in getConversation:', error);
    return { data: null, error };
  }
};

export const createConversation = async (userId: string, title: string) => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .insert([{ user_id: userId, title }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating conversation:', error);
    }
    
    return { data, error };
  } catch (error) {
    console.error('Unexpected error in createConversation:', error);
    return { data: null, error };
  }
};

export const updateConversationTitle = async (id: string, title: string) => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .update({ title })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating conversation ${id}:`, error);
    }
    
    return { data, error };
  } catch (error) {
    console.error('Unexpected error in updateConversationTitle:', error);
    return { data: null, error };
  }
};

export const deleteConversation = async (id: string) => {
  try {
    // First delete all messages in this conversation (assuming cascade delete is not set up)
    await supabase
      .from('messages')
      .delete()
      .eq('conversation_id', id);
    
    // Then delete the conversation
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting conversation ${id}:`, error);
    }
    
    return { error };
  } catch (error) {
    console.error('Unexpected error in deleteConversation:', error);
    return { error };
  }
};

/**
 * Message Functions
 */

export const getMessages = async (conversationId: string) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error(`Error fetching messages for conversation ${conversationId}:`, error);
    }
    
    return { data, error };
  } catch (error) {
    console.error('Unexpected error in getMessages:', error);
    return { data: null, error };
  }
};

export const createMessage = async (conversationId: string, role: 'user' | 'assistant', content: string) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([{ conversation_id: conversationId, role, content }])
      .select()
      .single();
    
    if (error) {
      console.error(`Error creating message in conversation ${conversationId}:`, error);
    }
    
    return { data, error };
  } catch (error) {
    console.error('Unexpected error in createMessage:', error);
    return { data: null, error };
  }
};

