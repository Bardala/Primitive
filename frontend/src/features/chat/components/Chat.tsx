import { useAuthContext } from '@/core/context';
import { isArabic, socket } from '@/core/utils';

import { LastReadMsg, SOCKET_EVENT, Space } from '@nest/shared';

import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { FormEvent, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { BiSend } from 'react-icons/bi';

import { useChatContext } from '../context/ChatContext';
import { useChat } from '../hooks/useChat';

import '../styles/chat.css';

export const Chat: React.FC<{ space: Space }> = ({ space }) => {
  const { currUser } = useAuthContext();
  const { msgMutate, chatQuery, chatErr, setNewMsg, newMsg } = useChat(space);
  const { t } = useTranslation();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: FormEvent | MouseEvent) => {
    e.preventDefault();
    if (newMsg.trim() === '') return;

    msgMutate.mutate({ content: newMsg, spaceId: space.id });
    if (msgMutate.isSuccess) setNewMsg('');
  };

  const { markSpaceAsRead, setActiveConversation } = useChatContext();

  // Set active conversation when viewing this space
  useEffect(() => {
    setActiveConversation(space.id, 'space');
    return () => {
      setActiveConversation(null, null);
    };
  }, [space.id, setActiveConversation]);

  // Emit READ_MESSAGE whenever messages update
  useEffect(() => {
    const lastMsgId = chatQuery.data?.messages[0]?.id;
    if (lastMsgId && currUser?.id) {
      socket.emit(SOCKET_EVENT.READ_MESSAGE, {
        spaceId: space.id,
        userId: currUser.id,
        lastReadId: lastMsgId,
      } as LastReadMsg);
      // Immediately update local state unread count
      void markSpaceAsRead(space.id);
    }
  }, [chatQuery.data?.messages, currUser?.id, space.id, markSpaceAsRead]);

  // Emit LEAVE_ROOM on unmount
  useEffect(() => {
    return () => {
      const lastMsgId = chatQuery.data?.messages[0]?.id;
      if (lastMsgId && currUser?.id) {
        socket.emit(SOCKET_EVENT.LEAVE_ROOM, {
          spaceId: space.id,
          userId: currUser.id,
          lastReadId: lastMsgId,
        } as LastReadMsg);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [space.id, currUser?.id]);

  if (chatErr) return <p className="error">{chatErr.message}</p>;

  return (
    <div className="chat-container">
      <div className="chat-messages-container">
        <ul className="chat-messages">
          {chatQuery.data?.messages.length === 0 ? (
            <div className="empty-chat">
              <p>{t('chat.noMessages')}</p>
            </div>
          ) : (
            chatQuery.data?.messages.map(msg => (
              <li
                key={msg.id}
                className={`message ${msg.userId === currUser?.id ? 'current-user' : ''}`}
              >
                <div className="message-content">
                  <div className="message-bubble">
                    <p className={isArabic(msg.content) ? 'arabic' : 'english'}>{msg.content}</p>
                  </div>
                  <div className="message-meta">
                    <span className="message-sender">{msg.username}</span>
                    <span className="message-time">
                      {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </li>
            ))
          )}
          <div ref={messagesEndRef} />
        </ul>
      </div>

      {msgMutate.isError && <div className="chat-error">{msgMutate.error?.message}</div>}

      <form onSubmit={handleSubmit} className="message-form">
        <div className="message-input-container">
          <textarea
            className={isArabic(newMsg) ? 'arabic' : 'english'}
            value={newMsg}
            onChange={e => setNewMsg(e.target.value)}
            placeholder={t('chat.placeholder')}
            onKeyDown={e => {
              if (e.key === 'Enter' && e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              } else if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                setNewMsg(prev => prev + '\n');
              }
            }}
          />
        </div>
        <button
          type="submit"
          className="send-button"
          disabled={msgMutate.isLoading || newMsg.trim().length === 0}
        >
          <BiSend />
        </button>
      </form>
    </div>
  );
};
