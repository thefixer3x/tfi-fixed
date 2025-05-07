import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, User, Bot } from 'lucide-react';
import { Message } from '@/types/chat';
import { Button } from '@/components/ui/button';

type ChatProps = {
  messages: Message[];
  onSendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
};

export function Chat({ messages, onSendMessage, isLoading }: ChatProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [inputValue]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const message = inputValue.trim();
    setInputValue('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    
    await onSendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format code blocks in messages
  const formatMessageContent = (content: string) => {
    // Simple regex to detect code blocks
    const codeBlockRegex = /```([a-zA-Z]*)\n([\s\S]*?)\n```/g;
    
    let parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push(<span key={`text-${lastIndex}`}>{content.slice(lastIndex, match.index)}</span>);
      }
      
      // Add code block
      const language = match[1] || '';
      const code = match[2];
      
      parts.push(
        <div key={`code-${match.index}`} className="my-2 bg-muted rounded-md overflow-x-auto">
          {language && (
            <div className="px-4 py-1 text-xs text-muted-foreground bg-muted/80 border-b border-border">
              {language}
            </div>
          )}
          <pre className="px-4 py-3 text-sm overflow-x-auto">
            <code>{code}</code>
          </pre>
        </div>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(<span key={`text-end`}>{content.slice(lastIndex)}</span>);
    }
    
    return parts.length > 0 ? parts : content;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Start a conversation by sending a message
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <div className="flex items-center mb-1">
                  {message.role === 'user' ? (
                    <User size={16} className="mr-2" />
                  ) : (
                    <Bot size={16} className="mr-2" />
                  )}
                  <span className="text-xs opacity-75">
                    {message.role === 'user' ? 'You' : 'Claude'}
                  </span>
                </div>
                <div className="whitespace-pre-wrap">
                  {formatMessageContent(message.content)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center bg-background rounded-lg border border-input">
          <button className="p-2 text-muted-foreground hover:text-foreground">
            <Paperclip size={20} />
          </button>
          
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 p-2 bg-transparent focus:outline-none resize-none min-h-[40px]"
            rows={1}
          />
          
          <Button 
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            variant="ghost"
            size="icon"
            className="rounded-r-lg"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            ) : (
              <Send size={18} />
            )}
          </Button>
        </div>
        
        <div className="mt-2 text-xs text-muted-foreground flex justify-between">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>Powered by Claude</span>
        </div>
      </div>
    </div>
  );
}

