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
    if (conversationId) {
      if (conversationId !== activeConversationId) {
        setActiveConversationId(conversationId);
      }
    } else {
      setActiveConversationId(null);
      setRecipientName('');
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
        {/* Left Column: Chat List - hidden on mobile when chat is active */}
        <div
          className={`flex h-full flex-col border-r border-border-light dark:border-border-dark/60 ${
            activeConversationId ? 'hidden md:flex md:w-[350px]' : 'w-full md:w-[350px]'
          }`}
        >
          <header className="sticky top-0 z-10 flex h-[53px] items-center border-b border-border-light bg-surface-light/80 px-4 backdrop-blur-md dark:border-border-dark dark:bg-black/80">
            <h1 className="text-xl font-bold tracking-tight text-text-primary-light dark:text-text-primary-dark">
              Messages
            </h1>
          </header>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <PrivateChatList activeId={activeConversationId} onSelect={handleSelectConversation} />
          </div>
        </div>

        {/* Right Column: Chat Window - hidden on mobile when no chat is active */}
        <div
          className={`flex flex-1 flex-col h-full bg-surface-light dark:bg-surface-dark ${
            !activeConversationId ? 'hidden md:flex items-center justify-center' : 'flex'
          }`}
        >
          {activeConversationId ? (
            <PrivateChatWindow
              conversationId={activeConversationId}
              recipientName={recipientName}
              onBack={handleBackToList}
            />
          ) : (
            <div className="p-8 text-center text-text-secondary-light dark:text-text-secondary-dark/60">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-50 dark:bg-primary-900/20">
                <svg viewBox="0 0 24 24" width="32" height="32" className="fill-current">
                  <path d="M1.75 3h20.5c.966 0 1.75.784 1.75 1.75v14.5A1.75 1.75 0 0 1 22.25 21H1.75A1.75 1.75 0 0 1 0 19.25V4.75C0 3.784.784 3 1.75 3zM22.25 4.5H1.75a.25.25 0 0 0-.25.25v1.478l9.733 6.17a1.25 1.25 0 0 0 1.514 0l9.733-6.17V4.75a.25.25 0 0 0-.25-.25zM1.5 8.292v10.958c0 .138.112.25.25.25h20.5a.25.25 0 0 0 .25-.25V8.292l-9.905 6.279a2.75 2.75 0 0 1-3.19 0L1.5 8.292z" />
                </svg>
              </div>
              <h2 className="mb-2 text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                Select a message
              </h2>
              <p className="mx-auto max-w-xs">
                Choose from your existing conversations, or start a new one.
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
