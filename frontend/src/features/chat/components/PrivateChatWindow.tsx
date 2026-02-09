import { LOCALS } from '@/core/utils';
import { UserStatus } from '@/features/user/components/UserStatus';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  useGetOtherUserId,
  useMarkAsRead,
  usePrivateConversations,
  usePrivateMessages,
  useSendPrivateMessage,
} from '../hooks/usePrivateChat';

import '../styles/private-chat.css';

interface PrivateChatWindowProps {
  conversationId: string;
  recipientName: string;
  onBack?: () => void;
}

/**
 * Format timestamp for message display (WhatsApp-like)
 */
const formatMessageTime = (date: Date | undefined): string => {
  if (!date) return '';

  const messageDate = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - messageDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Same day - show time only
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

  // Within a week - show day name
  if (diffDays < 7) {
    return messageDate.toLocaleDateString('en-US', { weekday: 'short' });
  }

  // Older - show date
  return messageDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export const PrivateChatWindow: React.FC<PrivateChatWindowProps> = ({
  conversationId,
  recipientName,
  onBack,
}) => {
  const [content, setContent] = useState('');
  const { data: messages, isLoading } = usePrivateMessages(conversationId);
  const otherUserId = useGetOtherUserId(conversationId);
  const { mutate: sendMessage, isLoading: isSending } = useSendPrivateMessage(
    conversationId,
    otherUserId
  );
  const { markAsRead } = useMarkAsRead();
  const { data: conversationsData } = usePrivateConversations();

  // Get recipient info from conversations
  const conversation = conversationsData?.conversations.find(c => c.id === conversationId);
  const recipientUser = conversation?.otherUser;
  // Type assertion since shared type doesn't have it yet but backend returns it
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const otherUserLastReadAt = (conversation as any)?.otherUserLastReadAt;

  // Auto-scroll to bottom
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLElement>(null);
  const hasMarkedAsRead = useRef(false);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Mark as read when viewing conversation
  useEffect(() => {
    if (conversationId && !hasMarkedAsRead.current) {
      hasMarkedAsRead.current = true;
      void markAsRead(conversationId);
    }
  }, [conversationId, markAsRead]);

  // Reset read marker when conversation changes
  useEffect(() => {
    hasMarkedAsRead.current = false;
  }, [conversationId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Mark as read when new messages arrive while viewing
  useEffect(() => {
    if (messages && messages.length > 0 && conversationId) {
      void markAsRead(conversationId);
    }
  }, [messages?.length, conversationId, markAsRead]);

  const getCurrentUserId = useCallback((): string | null => {
    const userStr = localStorage.getItem(LOCALS.CURR_USER);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr).id;
    } catch {
      return null;
    }
  }, []);

  const currentUserId = useMemo(() => getCurrentUserId(), [getCurrentUserId]);

  // Messages come from API newest first, reverse for display (oldest at top)
  const sortedMessages = useMemo(() => {
    return [...(messages ?? [])].reverse();
  }, [messages]);

  const handleSend = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmedContent = content.trim();
      if (!trimmedContent || isSending) return;

      sendMessage({ content: trimmedContent });
      setContent('');
    },
    [content, isSending, sendMessage]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Submit on Enter (but not Shift+Enter for multi-line in future)
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend(e);
      }
    },
    [handleSend]
  );

  if (isLoading) {
    return (
      <main className="private-chat-window private-chat-window--loading">
        <div className="private-chat-window__loading-spinner">
          <div className="spinner"></div>
          <p>Loading messages...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="private-chat-window" aria-label={`Chat with ${recipientName}`}>
      <header className="private-chat-window__header">
        <div className="private-chat-window__header-left">
          {onBack && (
            <button
              className="private-chat-window__back-btn"
              onClick={onBack}
              aria-label="Back to conversations"
            >
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path
                  fill="currentColor"
                  d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
                />
              </svg>
            </button>
          )}
          <div className="private-chat-window__header-info">
            <h1 className="private-chat-window__recipient-name">{recipientName}</h1>
            {recipientUser && (
              <UserStatus
                isOnline={recipientUser.isOnline}
                lastSeen={recipientUser.lastSeen}
                showText={true}
              />
            )}
          </div>
        </div>
      </header>

      <section
        ref={messagesContainerRef}
        className="private-chat-window__messages"
        aria-label="Message history"
        aria-live="polite"
      >
        {sortedMessages.length === 0 ? (
          <div className="private-chat-window__empty">
            <span className="private-chat-window__empty-icon" aria-hidden="true">
              💬
            </span>
            <p className="private-chat-window__empty-title">No messages yet</p>
            <p className="private-chat-window__empty-subtitle">
              Start the conversation with {recipientName}
            </p>
          </div>
        ) : (
          sortedMessages.map((msg, index) => {
            const isOwn = msg.senderId === currentUserId;
            const prevMsg = index > 0 ? sortedMessages[index - 1] : null;
            const showDateSeparator = prevMsg
              ? new Date(msg.createdAt || '').toDateString() !==
                new Date(prevMsg.createdAt || '').toDateString()
              : true;

            // Determine read/delivery status (WhatsApp-style)
            const msgDate = msg.createdAt ? new Date(msg.createdAt) : null;
            const lastReadDate = otherUserLastReadAt ? new Date(otherUserLastReadAt) : null;
            const lastActiveDate = (recipientUser as any)?.activity?.lastActive
              ? new Date((recipientUser as any).activity.lastActive)
              : null;

            // 1. Read: Message timestamp is before or equal to recipient's last read time
            const isRead = !!(msgDate && lastReadDate && msgDate <= lastReadDate);

            // 2. Delivered: Message is read OR recipient is currently online OR recipient was active after message was sent
            const isDelivered =
              isRead ||
              !!(
                msgDate &&
                (recipientUser?.isOnline || (lastActiveDate && msgDate <= lastActiveDate))
              );

            // 3. Sent: Default state (one checkmark) if not delivered yet
            const isSent = !isDelivered;

            return (
              <div key={msg.id}>
                {showDateSeparator && msg.createdAt && (
                  <div className="private-chat-window__date-separator">
                    <span>
                      {new Date(msg.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year:
                          new Date(msg.createdAt).getFullYear() !== new Date().getFullYear()
                            ? 'numeric'
                            : undefined,
                      })}
                    </span>
                  </div>
                )}
                <article
                  className={`private-chat-window__message ${
                    isOwn ? 'private-chat-window__message--own' : ''
                  }`}
                  aria-label={isOwn ? 'Your message' : `Message from ${recipientName}`}
                >
                  <div className="private-chat-window__message-bubble">
                    <p className="private-chat-window__message-text">{msg.content}</p>
                    <div className="private-chat-window__message-meta">
                      <time className="private-chat-window__message-time">
                        {formatMessageTime(msg.createdAt)}
                      </time>
                      {isOwn && (
                        <span
                          className={`private-chat-window__message-status ${
                            isRead ? 'private-chat-window__message-status--read' : ''
                          }`}
                          aria-label={isRead ? 'Read' : isDelivered ? 'Delivered' : 'Sent'}
                        >
                          {isSent ? (
                            // Single checkmark - Sent but not delivered
                            <svg
                              viewBox="0 0 16 15"
                              width="16"
                              height="15"
                              className="message-status-icon"
                            >
                              <path
                                fill="currentColor"
                                d="M10.91 3.316l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"
                              />
                            </svg>
                          ) : (
                            // Double checkmark - Delivered or Read
                            <svg
                              viewBox="0 0 16 15"
                              width="16"
                              height="15"
                              className="message-status-icon"
                            >
                              <path
                                fill="currentColor"
                                d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"
                              />
                            </svg>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} aria-hidden="true" />
      </section>

      <form
        className="private-chat-window__input-area"
        onSubmit={handleSend}
        aria-label="Send message"
      >
        <div className="private-chat-window__input-wrapper">
          <input
            id="message-input"
            className="private-chat-window__input"
            type="text"
            value={content}
            onChange={e => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${recipientName}`}
            autoComplete="off"
            aria-describedby="send-hint"
            disabled={isSending}
          />
          <button
            type="submit"
            className="private-chat-window__send-btn"
            disabled={!content.trim() || isSending}
            aria-label="Send message"
          >
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="currentColor"
                d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"
              />
            </svg>
          </button>
        </div>
        <span id="send-hint" className="visually-hidden">
          Press Enter or click Send to send your message
        </span>
      </form>
    </main>
  );
};
