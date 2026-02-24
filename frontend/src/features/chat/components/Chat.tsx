import { useAuthContext } from '@/core/context';
import { isArabic, socket } from '@/core/utils';

import { LastReadMsg, SOCKET_EVENT, Space } from '@nest/shared';

import { FormEvent, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { BiSend } from 'react-icons/bi';
import { TbBell, TbBellOff } from 'react-icons/tb';

import { useChatContext } from '../context/ChatContext';
import { useChat } from '../hooks/useChat';

const formatMessageTime = (date: Date | string | number | undefined): string => {
  if (!date) return '';

  const messageDate = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - messageDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return messageDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return messageDate.toLocaleDateString('en-US', { weekday: 'short' });
  return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const Chat: React.FC<{ space: Space; variant?: 'default' | 'modern' }> = ({
  space,
  variant = 'default',
}) => {
  const { currUser } = useAuthContext();
  const { msgMutate, chatQuery, chatErr, setNewMsg, newMsg } = useChat(space);
  const { t } = useTranslation();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isModern = variant === 'modern';

  const handleSubmit = (e: FormEvent | MouseEvent) => {
    e.preventDefault();
    if (newMsg.trim() === '') return;

    msgMutate.mutate({ content: newMsg, spaceId: space.id });
    if (msgMutate.isSuccess) setNewMsg('');
  };

  const { markSpaceAsRead, setActiveConversation, spaces, toggleSpaceMute } = useChatContext();
  const currentSpace = spaces.find(s => s.id === space.id);
  const isMuted = currentSpace?.isMuted;

  useEffect(() => {
    setActiveConversation(space.id, 'space');
    return () => {
      setActiveConversation(null, null);
    };
  }, [space.id, setActiveConversation]);

  useEffect(() => {
    const lastMsgId = chatQuery.data?.messages[0]?.id;
    if (lastMsgId && currUser?.id) {
      socket.emit(SOCKET_EVENT.READ_MESSAGE, {
        spaceId: space.id,
        userId: currUser.id,
        lastReadId: lastMsgId,
      } as LastReadMsg);
      void markSpaceAsRead(space.id);
    }
  }, [chatQuery.data?.messages, currUser?.id, space.id, markSpaceAsRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatQuery.data?.messages]);

  if (chatErr)
    return (
      <p className="mb-4 rounded-lg bg-red-50 p-4 text-center text-red-600 dark:bg-red-900/20 dark:text-red-400">
        {chatErr.message}
      </p>
    );

  return (
    <div
      className={`flex flex-col h-full w-full ${
        isModern
          ? 'bg-[#efeae2] dark:bg-[#0b141a]'
          : 'rounded-2xl border border-border-light bg-surface-light shadow-sm dark:border-border-dark dark:bg-surface-dark'
      }`}
      style={
        isModern
          ? {
              backgroundImage:
                "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
              backgroundBlendMode: 'overlay',
              backgroundSize: 'contain',
            }
          : {}
      }
    >
      {isModern && (
        <div className="flex items-center justify-between border-b border-border-light bg-surface-light px-4 py-2 dark:border-border-dark dark:bg-surface-dark">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">
              {space.name}
            </span>
          </div>
          <button
            onClick={() => toggleSpaceMute(space.id, !isMuted)}
            className={`rounded-full p-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${
              isMuted ? 'text-red-500' : 'text-text-secondary-light dark:text-text-secondary-dark'
            }`}
            title={isMuted ? 'Unmute' : 'Mute Notifications'}
          >
            {isMuted ? <TbBellOff size={20} /> : <TbBell size={20} />}
          </button>
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <ul className="flex flex-col gap-2">
          {chatQuery.data?.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 opacity-60">
              <span className="text-4xl mb-4">💬</span>
              <p className="font-medium">{t('chat.noMessages')}</p>
            </div>
          ) : (
            [...(chatQuery.data?.messages ?? [])].reverse().map((msg, index, arr) => {
              const isMe = msg.userId === currUser?.id;
              const prevMsg = index > 0 ? arr[index - 1] : null;
              const showUser = !prevMsg || prevMsg.userId !== msg.userId;

              return (
                <li
                  key={msg.id}
                  className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} ${
                    showUser ? 'mt-3' : 'mt-0.5'
                  }`}
                >
                  <div className={`flex flex-col max-w-[85%] md:max-w-[75%]`}>
                    <div
                      className={`relative rounded-lg px-3 py-1.5 text-sm shadow-sm ${
                        isMe
                          ? 'bg-[#d9fdd3] text-gray-900 rounded-tr-none dark:bg-[#005c4b] dark:text-gray-100'
                          : 'bg-white text-gray-900 rounded-tl-none dark:bg-[#202c33] dark:text-gray-100'
                      }`}
                    >
                      {!isMe && showUser && (
                        <span className="mb-1 block text-[11px] font-bold text-primary-600 dark:text-primary-400">
                          {msg.username}
                        </span>
                      )}
                      <p
                        className={`whitespace-pre-wrap wrap-break-word pr-12 ${
                          isArabic(msg.content) ? 'text-right' : 'text-left'
                        }`}
                      >
                        {msg.content}
                      </p>
                      <time className="absolute bottom-1 right-2 text-[9px] opacity-60">
                        {formatMessageTime(msg.timestamp)}
                      </time>
                    </div>
                  </div>
                </li>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </ul>
      </div>

      <form
        onSubmit={handleSubmit}
        className={`flex items-end gap-2 p-3 ${
          isModern
            ? 'bg-surface-light dark:bg-surface-dark border-t border-border-light dark:border-border-dark'
            : 'border-t border-border-light p-3 dark:border-border-dark rounded-b-2xl'
        }`}
      >
        <div className="flex-1">
          <textarea
            className={`w-full resize-none rounded-xl border border-gray-200 bg-background-light px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-background-dark dark:text-text-primary-dark ${
              isArabic(newMsg) ? 'text-right' : 'text-left'
            }`}
            value={newMsg}
            onChange={e => setNewMsg(e.target.value)}
            placeholder={t('chat.placeholder')}
            rows={1}
            style={{ minHeight: '40px', maxHeight: '120px' }}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as any);
              }
            }}
          />
        </div>
        <button
          type="submit"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white shadow-md transition-all hover:bg-primary-700 active:scale-95 disabled:opacity-50"
          disabled={msgMutate.isLoading || newMsg.trim().length === 0}
        >
          <BiSend size={20} className="ml-0.5" />
        </button>
      </form>
    </div>
  );
};
