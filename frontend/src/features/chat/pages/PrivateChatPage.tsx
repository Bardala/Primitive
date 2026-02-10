import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { PrivateChatList } from '../components/PrivateChatList';
import { PrivateChatWindow } from '../components/PrivateChatWindow';

import '../styles/private-chat.css';

export const PrivateChatPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [recipientName, setRecipientName] = useState<string>('');

  // Auto-select conversation from URL parameter
  useEffect(() => {
    const conversationId = searchParams.get('conversationId');
    if (conversationId && conversationId !== activeConversationId) {
      setActiveConversationId(conversationId);
    }
  }, [searchParams, activeConversationId]);

  const handleSelectConversation = (id: string, name: string, type: 'private' | 'space') => {
    if (type === 'space') {
      navigate(`/space/${id}`);
      return;
    }
    setActiveConversationId(id);
    setRecipientName(name);
    // Update URL to reflect selected conversation
    setSearchParams({ conversationId: id });
  };

  const handleBackToList = () => {
    setActiveConversationId(null);
    setRecipientName('');
    setSearchParams({});
  };

  return (
    <div
      className={`private-chat-page ${
        activeConversationId ? 'private-chat-page--window-active' : ''
      }`}
      role="application"
      aria-label="Private messaging"
    >
      <PrivateChatList activeId={activeConversationId} onSelect={handleSelectConversation} />

      {activeConversationId ? (
        <PrivateChatWindow
          conversationId={activeConversationId}
          recipientName={recipientName}
          onBack={handleBackToList}
        />
      ) : (
        <main className="private-chat-window desktop-only">
          <div className="private-chat-window__empty">
            <span className="private-chat-window__empty-icon" aria-hidden="true">
              💬
            </span>
            <p className="private-chat-window__empty-title">Select a conversation</p>
            <p className="private-chat-window__empty-subtitle">
              Choose a conversation from the list to start chatting
            </p>
          </div>
        </main>
      )}
    </div>
  );
};
