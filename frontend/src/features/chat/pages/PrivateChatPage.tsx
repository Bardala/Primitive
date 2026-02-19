import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { PrivateChatList } from '../components/PrivateChatList';
import { PrivateChatWindow } from '../components/PrivateChatWindow';

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
      className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-background-light dark:bg-background-dark"
      role="application"
      aria-label="Private messaging"
    >
      <div
        className={`${
          activeConversationId ? 'hidden md:flex' : 'flex'
        } w-full flex-col border-r border-border-light dark:border-border-dark md:w-80 lg:w-96`}
      >
        <PrivateChatList activeId={activeConversationId} onSelect={handleSelectConversation} />
      </div>

      <div
        className={`${
          !activeConversationId ? 'hidden md:flex' : 'flex'
        } w-full flex-1 flex-col bg-surface-light dark:bg-surface-dark`}
      >
        {activeConversationId ? (
          <PrivateChatWindow
            conversationId={activeConversationId}
            recipientName={recipientName}
            onBack={handleBackToList}
          />
        ) : (
          <main className="flex h-full flex-col items-center justify-center p-8 text-center text-text-secondary-light dark:text-text-secondary-dark hidden md:flex">
            <div className="flex flex-col items-center justify-center">
              <span className="mb-4 text-6xl opacity-50" aria-hidden="true">
                💬
              </span>
              <p className="mb-2 text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
                Select a conversation
              </p>
              <p className="max-w-xs text-sm">
                Choose a conversation from the list to start chatting
              </p>
            </div>
          </main>
        )}
      </div>
    </div>
  );
};
