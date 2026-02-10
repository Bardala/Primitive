import { TbBell, TbBellOff, TbUser, TbUsers } from 'react-icons/tb';

import { useChatContext } from '../context/ChatContext';

import '../styles/private-chat.css';

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
      <aside className="private-chat-list private-chat-list--loading">
        <div className="spinner"></div>
        <p>Loading chats...</p>
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
    <aside className="private-chat-list" aria-label="Chats">
      <header className="private-chat-list__header">
        <h2>Messages</h2>
      </header>

      {allChats.length === 0 ? (
        <div className="private-chat-list__empty">
          <span className="private-chat-list__empty-icon" aria-hidden="true">
            💬
          </span>
          <p>No conversations yet</p>
        </div>
      ) : (
        <ul className="private-chat-list__items" role="listbox" aria-label="Conversation list">
          {allChats.map(chat => (
            <li key={chat.id}>
              <article
                className={`private-chat-list__item ${
                  activeId === chat.id ? 'private-chat-list__item--active' : ''
                } ${chat.chatType === 'space' ? 'private-chat-list__item--space' : ''}`}
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
                <div className="private-chat-list__avatar-container">
                  {chat.chatType === 'space' ? <TbUsers /> : <TbUser />}
                  {chat.chatType === 'private' && chat.otherUser.isOnline && (
                    <span className="private-chat-list__online-indicator"></span>
                  )}
                </div>

                <div className="private-chat-list__content">
                  <div className="private-chat-list__header-row">
                    <span className="private-chat-list__username">
                      {chat.chatType === 'private' ? chat.otherUser.username : chat.name}
                    </span>
                    <div className="private-chat-list__meta">
                      {chat.lastMessage && (
                        <time className="private-chat-list__time">
                          {formatMessageTime(
                            chat.lastMessage.createdAt || chat.lastMessage.timestamp
                          )}
                        </time>
                      )}
                      <div className="private-chat-list__actions">
                        <button
                          className="private-chat-list__mute-btn"
                          onClick={e => {
                            e.stopPropagation();
                            handleToggleMute(chat.id, chat.chatType, chat.isMuted);
                          }}
                          title={chat.isMuted ? 'Unmute' : 'Mute'}
                        >
                          {chat.isMuted ? <TbBellOff /> : <TbBell />}
                        </button>
                        {chat.unreadCount > 0 && (
                          <span className="private-chat-list__unread-badge">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="private-chat-list__preview">
                    {chat.lastMessage?.content ?? 'No messages yet'}
                  </p>
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
