import { usePrivateConversations } from '../hooks/usePrivateChat';

import '../styles/private-chat.css';

interface PrivateChatListProps {
  activeConversationId: string | null;
  onSelectConversation: (id: string, name: string) => void;
}

export const PrivateChatList: React.FC<PrivateChatListProps> = ({
  activeConversationId,
  onSelectConversation,
}) => {
  const { data, isLoading } = usePrivateConversations();

  if (isLoading) {
    return (
      <aside className="private-chat-list private-chat-list--loading">
        <div className="spinner"></div>
        <p>Loading conversations...</p>
      </aside>
    );
  }

  const conversations = data?.conversations ?? [];

  return (
    <aside className="private-chat-list" aria-label="Conversations">
      <header className="private-chat-list__header">
        <h2>Messages</h2>
      </header>

      {conversations.length === 0 ? (
        <div className="private-chat-list__empty">
          <span className="private-chat-list__empty-icon" aria-hidden="true">
            💬
          </span>
          <p>No conversations yet</p>
        </div>
      ) : (
        <ul className="private-chat-list__items" role="listbox" aria-label="Conversation list">
          {conversations.map(convo => (
            <li key={convo.id}>
              <article
                className={`private-chat-list__item ${
                  activeConversationId === convo.id ? 'private-chat-list__item--active' : ''
                }`}
                onClick={() => onSelectConversation(convo.id, convo.otherUser.username)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectConversation(convo.id, convo.otherUser.username);
                  }
                }}
                role="option"
                aria-selected={activeConversationId === convo.id}
                tabIndex={0}
              >
                <div className="private-chat-list__user-info">
                  <div className="private-chat-list__user-name-container">
                    <span className="private-chat-list__username">{convo.otherUser.username}</span>
                    {convo.otherUser.isOnline && (
                      <span
                        className="private-chat-list__online-indicator"
                        aria-label="Online"
                        title="Online"
                      ></span>
                    )}
                  </div>
                  <div className="private-chat-list__meta">
                    {convo.lastMessage?.createdAt && (
                      <time className="private-chat-list__time">
                        {formatMessageTime(convo.lastMessage.createdAt)}
                      </time>
                    )}
                    {convo.unreadCount > 0 && (
                      <span
                        className="private-chat-list__unread-badge"
                        aria-label={`${convo.unreadCount} unread messages`}
                      >
                        {convo.unreadCount}
                      </span>
                    )}
                  </div>
                </div>

                <p
                  className={`private-chat-list__preview ${
                    !convo.lastMessage ? 'private-chat-list__preview--empty' : ''
                  }`}
                >
                  {convo.lastMessage?.content ?? 'No messages yet'}
                </p>
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
