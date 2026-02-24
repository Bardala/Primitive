import { LOCALS } from '@/core/utils';
import { UserStatus } from '@/features/user/components/UserStatus';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useChatContext } from '../context/ChatContext';
import {
  useGetOtherUserId,
  useMarkAsRead,
  usePrivateConversations,
  usePrivateMessages,
  useSendPrivateMessage,
} from '../hooks/usePrivateChat';

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
  const { setActiveConversation } = useChatContext();

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

  // Set active conversation when component mounts, clear when unmounts
  useEffect(() => {
    setActiveConversation(conversationId, 'private');
    return () => {
      setActiveConversation(null, null);
    };
  }, [conversationId, setActiveConversation]);

  // Mark as read when viewing conversation
  useEffect(() => {
    if (conversationId && !hasMarkedAsRead.current) {
      const lastMsgId = messages && messages.length > 0 ? messages[0].id : undefined;
      hasMarkedAsRead.current = true;
      void markAsRead(conversationId, lastMsgId);
    }
  }, [conversationId, markAsRead, messages]);

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
      void markAsRead(conversationId, messages[0].id);
    }
  }, [messages?.length, conversationId, markAsRead, messages]);

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
      <main className="flex h-full w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4 text-text-secondary-light dark:text-text-secondary-dark">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></div>
          <p>Loading messages...</p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="flex h-full flex-col bg-background-light dark:bg-background-dark"
      aria-label={`Chat with ${recipientName}`}
    >
      <header className="flex h-16 items-center border-b border-border-light bg-surface-light px-4 shadow-sm dark:border-border-dark dark:bg-surface-dark">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              className="mr-2 rounded-full p-2 text-text-secondary-light hover:bg-gray-100 dark:text-text-secondary-dark dark:hover:bg-primary-900/20"
              onClick={onBack}
              aria-label="Back to conversations"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" className="fill-current">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
              </svg>
            </button>
          )}
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
              {recipientName}
            </h1>
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
        className="flex-1 overflow-y-auto bg-[#efeae2] p-4 custom-scrollbar dark:bg-[#0b141a]"
        aria-label="Message history"
        aria-live="polite"
        style={{
          backgroundImage:
            "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
          backgroundBlendMode: 'overlay',
          backgroundSize: 'contain',
        }}
      >
        {sortedMessages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center opacity-60">
            <span className="mb-4 text-6xl" aria-hidden="true">
              💬
            </span>
            <p className="mb-2 text-lg font-medium text-text-primary-light dark:text-text-primary-dark">
              No messages yet
            </p>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
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
              <div key={msg.id} className="mb-2">
                {showDateSeparator && msg.createdAt && (
                  <div className="mb-4 flex justify-center">
                    <span className="rounded-lg bg-surface-light px-3 py-1 text-xs font-medium text-text-secondary-light shadow-sm dark:bg-surface-dark dark:text-text-secondary-dark">
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
                  className={`flex w-full ${isOwn ? 'justify-end' : 'justify-start'}`}
                  aria-label={isOwn ? 'Your message' : `Message from ${recipientName}`}
                >
                  <div
                    className={`relative max-w-[85%] rounded-lg px-3 py-2 text-sm shadow-sm md:max-w-[65%] ${
                      isOwn
                        ? 'bg-[#d9fdd3] text-gray-900 rounded-tr-none dark:bg-[#005c4b] dark:text-gray-100'
                        : 'bg-white text-gray-900 rounded-tl-none dark:bg-[#202c33] dark:text-gray-100'
                    }`}
                  >
                    <p className="whitespace-pre-wrap wrap-break-word pr-16">{msg.content}</p>
                    <div className="absolute bottom-1 right-2 flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
                      <time>{formatMessageTime(msg.createdAt)}</time>
                      {isOwn && (
                        <span
                          className={`ml-1 ${
                            isRead ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'
                          }`}
                          aria-label={isRead ? 'Read' : isDelivered ? 'Delivered' : 'Sent'}
                        >
                          {isSent ? (
                            // Single checkmark
                            <svg
                              viewBox="0 0 16 15"
                              width="16"
                              height="15"
                              className="h-3 w-3 fill-current"
                            >
                              <path d="M10.91 3.316l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" />
                            </svg>
                          ) : (
                            // Double checkmark
                            <svg
                              viewBox="0 0 16 15"
                              width="16"
                              height="15"
                              className="h-3 w-3 fill-current"
                            >
                              <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" />
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
        className="flex items-end gap-2 border-t border-border-light bg-surface-light p-3 dark:border-border-dark dark:bg-surface-dark"
        onSubmit={handleSend}
        aria-label="Send message"
      >
        <div className="flex-1 rounded-xl bg-background-light px-4 py-2 dark:bg-background-dark">
          <input
            id="message-input"
            className="w-full bg-transparent py-2 text-sm focus:outline-none dark:text-text-primary-dark"
            type="text"
            value={content}
            onChange={e => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${recipientName}`}
            autoComplete="off"
            aria-describedby="send-hint"
            disabled={isSending}
          />
        </div>
        <button
          type="submit"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white transition-all hover:bg-primary-700 hover:shadow-md disabled:opacity-50"
          disabled={!content.trim() || isSending}
          aria-label="Send message"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" className="fill-current ml-1">
            <path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z" />
          </svg>
        </button>
        <span id="send-hint" className="visually-hidden hidden">
          Press Enter or click Send to send your message
        </span>
      </form>
    </main>
  );
};
