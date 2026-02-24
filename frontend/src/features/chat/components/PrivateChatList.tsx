import { TbBell, TbBellOff, TbUser, TbUsers } from 'react-icons/tb';

import { useChatContext } from '../context/ChatContext';

interface ConversationListProps {
  activeId: string | null;
  onSelect: (id: string, name: string, type: 'private' | 'space') => void;
}

export const PrivateChatList: React.FC<ConversationListProps> = ({ activeId, onSelect }) => {
  const { privateConversations, spaces, isLoading, togglePrivateMute, toggleSpaceMute } =
    useChatContext();

  const handleToggleMute = (chatId: string, chatType: 'private' | 'space', isMuted?: boolean) => {
    if (chatType === 'private') {
      void togglePrivateMute(chatId, !isMuted);
    } else {
      void toggleSpaceMute(chatId, !isMuted);
    }
  };

  if (isLoading) {
    return (
      <aside className="fixed inset-y-0 left-0 w-full overflow-hidden border-r border-border-light bg-surface-light dark:border-border-dark dark:bg-surface-dark md:relative md:w-80">
        <div className="flex h-full flex-col items-center justify-center gap-4 text-text-secondary-light dark:text-text-secondary-dark">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></div>
          <p>Loading chats...</p>
        </div>
      </aside>
    );
  }

  const allChats = [
    ...spaces.map(s => ({ ...s, chatType: 'space' as const })),
    ...privateConversations.map(c => ({
      ...c,
      chatType: 'private' as const,
      name: c.otherUser.username,
      id: c.id,
    })),
  ].sort((a, b) => {
    const dateA = new Date(a.lastMessage?.createdAt || a.lastMessage?.timestamp || 0);
    const dateB = new Date(b.lastMessage?.createdAt || b.lastMessage?.timestamp || 0);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <aside
      className="flex h-full w-full flex-col border-r border-border-light bg-surface-light dark:border-border-dark dark:bg-surface-dark md:w-80"
      aria-label="Chats"
    >
      <header className="flex h-16 items-center justify-between border-b border-border-light px-4 dark:border-border-dark">
        <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
          Messages
        </h2>
      </header>

      {allChats.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-text-secondary-light dark:text-text-secondary-dark/60">
          <span className="mb-4 text-4xl opacity-50" aria-hidden="true">
            💬
          </span>
          <p>No conversations yet</p>
        </div>
      ) : (
        <ul
          className="flex-1 overflow-y-auto custom-scrollbar"
          role="listbox"
          aria-label="Conversation list"
        >
          {allChats.map(chat => (
            <li key={chat.id}>
              <article
                className={`group relative flex cursor-pointer gap-3 border-b border-border-light p-4 transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none dark:border-border-dark dark:hover:bg-primary-900/10 dark:focus:bg-primary-900/10 ${
                  activeId === chat.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                }`}
                onClick={() =>
                  onSelect(
                    chat.id,
                    chat.chatType === 'private' ? chat.otherUser.username : chat.name,
                    chat.chatType
                  )
                }
                role="option"
                aria-selected={activeId === chat.id}
                tabIndex={0}
              >
                <div className="relative shrink-0">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full text-white ${
                      chat.chatType === 'space'
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-500'
                        : 'bg-gradient-to-br from-gray-400 to-gray-500'
                    }`}
                  >
                    {chat.chatType === 'space' ? <TbUsers size={24} /> : <TbUser size={24} />}
                  </div>
                  {chat.chatType === 'private' && chat.otherUser.isOnline && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-surface-light bg-green-500 dark:border-surface-dark"></span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="truncate text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                      {chat.chatType === 'private' ? chat.otherUser.username : chat.name}
                    </span>
                    <div className="flex items-center gap-2">
                      {chat.lastMessage && (
                        <time className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark">
                          {formatMessageTime(
                            chat.lastMessage.createdAt || chat.lastMessage.timestamp
                          )}
                        </time>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      {chat.lastMessage?.content ?? 'No messages yet'}
                    </p>
                    <div className="flex items-center gap-1">
                      <button
                        className={`opacity-0 transition-opacity group-hover:opacity-100 ${
                          chat.isMuted
                            ? 'text-red-500 opacity-100'
                            : 'text-text-secondary-light dark:text-text-secondary-dark'
                        }`}
                        onClick={e => {
                          e.stopPropagation();
                          handleToggleMute(chat.id, chat.chatType, chat.isMuted);
                        }}
                        title={chat.isMuted ? 'Unmute' : 'Mute'}
                      >
                        {chat.isMuted ? <TbBellOff size={16} /> : <TbBell size={16} />}
                      </button>
                      {chat.unreadCount > 0 && (
                        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary-600 px-1 text-[10px] font-bold text-white shadow-sm">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};

/**
 * Format timestamp for conversation list (WhatsApp-like)
 */
const formatMessageTime = (date: Date | undefined): string => {
  if (!date) return '';

  const messageDate = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - messageDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Today - show time
  if (diffDays === 0) {
    return messageDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  // Yesterday
  if (diffDays === 1) {
    return 'Yesterday';
  }

  // This week - show day
  if (diffDays < 7) {
    return messageDate.toLocaleDateString('en-US', { weekday: 'short' });
  }

  // Older - show date
  return messageDate.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
  });
};
