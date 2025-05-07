import { useState } from 'react';
import { MessageSquare, User, LogOut, PlusCircle, Trash2, Edit, X, Moon, Sun } from 'lucide-react';
import { Conversation, User as UserType } from '@/types/chat';
import { Button } from '@/components/ui/button';

type SidebarProps = {
  user: UserType;
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onCreateConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
};

export function Sidebar({
  user,
  conversations,
  currentConversationId,
  onSelectConversation,
  onCreateConversation,
  onDeleteConversation,
  onRenameConversation,
  onLogout,
  darkMode,
  onToggleDarkMode,
}: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const startEditing = (id: string, currentTitle: string) => {
    setEditingId(id);
    setNewTitle(currentTitle);
  };

  const saveEditing = (id: string) => {
    if (newTitle.trim()) {
      onRenameConversation(id, newTitle.trim());
    }
    setEditingId(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  return (
    <div
      className={`flex flex-col bg-muted/40 border-r border-border transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-16'
      }`}
    >
      <div className="p-4 border-b border-border flex items-center justify-between">
        {isExpanded ? (
          <h1 className="text-lg font-semibold">The Fixer Initiative</h1>
        ) : (
          <span className="text-xl font-bold">TFI</span>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-auto"
        >
          {isExpanded ? '←' : '→'}
        </Button>
      </div>
      
      <div className="p-3">
        <Button
          className="w-full justify-start gap-2"
          onClick={onCreateConversation}
        >
          <PlusCircle size={16} />
          {isExpanded && "New Conversation"}
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No conversations yet. Start a new one!
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={`p-3 group cursor-pointer hover:bg-muted ${
                currentConversationId === conv.id ? 'bg-muted' : ''
              }`}
            >
              {editingId === conv.id ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEditing(conv.id);
                      if (e.key === 'Escape') cancelEditing();
                    }}
                    className="flex-1 p-1 bg-background border border-input rounded"
                    autoFocus
                  />
                  <Button
                    onClick={() => saveEditing(conv.id)}
                    variant="ghost"
                    size="icon"
                    className="ml-1 text-green-600 hover:text-green-700 h-8 w-8"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </Button>
                  <Button
                    onClick={cancelEditing}
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive/90 h-8 w-8"
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <div onClick={() => onSelectConversation(conv.id)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <MessageSquare size={16} />
                      {isExpanded && (
                        <span className="truncate">{conv.title}</span>
                      )}
                    </div>
                    
                    {isExpanded && (
                      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(conv.id, conv.title);
                          }}
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteConversation(conv.id);
                          }}
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {isExpanded && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatDate(conv.createdAt)}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 overflow-hidden">
            <User size={isExpanded ? 16 : 20} />
            {isExpanded && (
              <span className="text-sm truncate">{user.email}</span>
            )}
          </div>
          <Button 
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="text-muted-foreground hover:text-destructive"
          >
            <LogOut size={16} />
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          {isExpanded && <span className="text-sm">Theme</span>}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDarkMode}
            className="ml-auto"
          >
            {darkMode ? (
              <Moon size={16} />
            ) : (
              <Sun size={16} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

