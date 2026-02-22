import { MainLayout } from '@/app/layout';

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
    <MainLayout>
      <div
        className="flex h-[calc(100vh-64px)] sm:h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark relative"
        role="application"
        aria-label="Private messaging"
      >
        {!activeConversationId ? (
          <div className="flex w-full flex-col h-full">
            <header className="px-4 py-3 flex items-center border-b border-border-light dark:border-border-dark bg-surface-light/80 dark:bg-black/80 backdrop-blur-md z-10 sticky top-0 h-[53px]">
              <h1 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark tracking-tight">
                Messages
              </h1>
            </header>
            <div className="flex-1 overflow-y-auto no-scrollbar">
              <PrivateChatList
                activeId={activeConversationId}
                onSelect={handleSelectConversation}
              />
            </div>
          </div>
        ) : (
          <div className="flex w-full flex-col h-full bg-surface-light dark:bg-surface-dark">
            <PrivateChatWindow
              conversationId={activeConversationId}
              recipientName={recipientName}
              onBack={handleBackToList}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
};
