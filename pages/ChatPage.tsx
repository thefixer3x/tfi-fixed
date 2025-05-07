import { useState, useEffect } from 'react'
import { Chat } from '@/components/chat/Chat'
import { Sidebar } from '@/components/chat/Sidebar'
import { Message } from '@/types/chat'
import { sendMessageToClaudeAPI, prepareMessagesForClaudeAPI } from '@/lib/claude-service'
import { supabase, getConversations, createConversation, updateConversationTitle, deleteConversation, createMessage, getMessages } from '@/lib/supabase'
import { useTheme } from '@/lib/theme-provider'

const ChatPage = () => {
  const [conversations, setConversations] = useState<any[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { user: currentUser } = await supabase.auth.getUser()
      if (currentUser) {
        setUser(currentUser)
        loadConversations()
      }
    }
    
    checkAuth()
  }, [])

  const loadConversations = async () => {
    const { data } = await getConversations()
    if (data && data.length > 0) {
      setConversations(data)
      setCurrentConversationId(data[0].id)
      loadMessages(data[0].id)
    }
  }

  const loadMessages = async (conversationId: string) => {
    const { data } = await getMessages(conversationId)
    if (data) {
      setMessages(data.map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.created_at).getTime()
      })))
    }
  }

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id)
    loadMessages(id)
  }

  const handleCreateConversation = async () => {
    if (!user) return
    
    const { data } = await createConversation(
      user.id, 
      'New Conversation'
    )
    
    if (data) {
      setConversations([data, ...conversations])
      setCurrentConversationId(data.id)
      setMessages([])
    }
  }

  const handleRenameConversation = async (id: string, newTitle: string) => {
    const { data } = await updateConversationTitle(id, newTitle)
    if (data) {
      setConversations(
        conversations.map(conv => 
          conv.id === id ? { ...conv, title: newTitle } : conv
        )
      )
    }
  }

  const handleDeleteConversation = async (id: string) => {
    await deleteConversation(id)
    
    const updatedConversations = conversations.filter(conv => conv.id !== id)
    setConversations(updatedConversations)
    
    // If we deleted the current conversation, select another one
    if (id === currentConversationId) {
      if (updatedConversations.length > 0) {
        setCurrentConversationId(updatedConversations[0].id)
        loadMessages(updatedConversations[0].id)
      } else {
        setCurrentConversationId(null)
        setMessages([])
      }
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!currentConversationId || !content.trim()) return
    
    // Add user message to UI
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now()
    }
    
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setIsLoading(true)
    
    try {
      // Save message to database
      const { data: savedMessage } = await createMessage(
        currentConversationId,
        'user',
        content
      )
      
      // Update conversation title for new conversations
      const currentConv = conversations.find(c => c.id === currentConversationId)
      if (currentConv && currentConv.title === 'New Conversation') {
        // Use first few words of message as title
        const newTitle = content.split(' ').slice(0, 5).join(' ') + '...'
        await handleRenameConversation(currentConversationId, newTitle)
      }
      
      // Send to Claude API
      const apiMessages = updatedMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
      
      const prepared = prepareMessagesForClaudeAPI(apiMessages)
      const response = await sendMessageToClaudeAPI(currentConversationId, prepared)
      
      // Save assistant's response
      const { data: assistantMessage } = await createMessage(
        currentConversationId,
        'assistant',
        response.message
      )
      
      // Update UI with assistant response
      if (assistantMessage) {
        setMessages([...updatedMessages, {
          id: assistantMessage.id,
          role: 'assistant',
          content: response.message,
          timestamp: Date.now()
        }])
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // Show error to user
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setConversations([])
    setCurrentConversationId(null)
    setMessages([])
  }

  return (
    <div className="flex h-full">
      <Sidebar
        user={user || { id: '', email: '' }}
        conversations={conversations.map(conv => ({ 
          id: conv.id, 
          title: conv.title, 
          createdAt: new Date(conv.created_at).getTime() 
        }))}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onCreateConversation={handleCreateConversation}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
        onLogout={handleLogout}
        darkMode={theme === 'dark'}
        onToggleDarkMode={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />
      
      <div className="flex-1 flex flex-col h-full">
        {currentConversationId ? (
          <Chat 
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">No conversation selected</h2>
              <p className="text-muted-foreground mb-4">Create a new conversation or select an existing one</p>
              <button
                onClick={handleCreateConversation}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                New Conversation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatPage

