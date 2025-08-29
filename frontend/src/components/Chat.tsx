import { Space } from '@nest/shared';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { FormEvent, useRef } from 'react';
import { BiSend } from 'react-icons/bi';
import { isArabic, preprocessMarkdown } from 'src/utils/assists';

import { useAuthContext } from '../context/AuthContext';
import { useChat } from '../hooks/useChat';
import '../styles/chat.css';

export const Chat: React.FC<{ space: Space }> = ({ space }) => {
  const { currUser } = useAuthContext();
  const { msgMutate, chatQuery, chatErr, setNewMsg, newMsg } = useChat(space);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLUListElement>(null);

  const handleSubmit = (e: FormEvent | MouseEvent) => {
    e.preventDefault();
    if (newMsg.trim() === '') return;
    msgMutate.mutate();
  };

  if (chatErr) return <p className="error">{chatErr.message}</p>;
  return (
    <div className="chat-container">
      <div className="chat-messages-container">
        <ul className="chat-messages" ref={chatContainerRef}>
          {chatQuery.data?.messages.length === 0 ? (
            <div className="empty-chat">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            chatQuery.data?.messages.map(msg => (
              <li
                key={msg.id}
                className={`message ${msg.userId === currUser?.id ? 'current-user' : ''}`}
              >
                <div className="message-content">
                  <div className="message-bubble">
                    <p>{msg.content}</p>
                  </div>
                  <div className="message-meta">
                    <span className="message-sender">{msg.username}</span>
                    <span className="message-time">
                      {formatDistanceToNow(new Date(msg.timestamp as number), { addSuffix: true })}
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
            className={isArabic(newMsg) ? 'arabic' : ''}
            value={newMsg}
            onChange={e => setNewMsg(preprocessMarkdown(e.target.value))}
            placeholder="Type your message..."
            onKeyDown={e => {
              if (e.key === 'Enter' && e.shiftKey) {
                // Shift+Enter submits the form
                e.preventDefault();
                handleSubmit(e);
              } else if (e.key === 'Enter' && !e.shiftKey) {
                // Just Enter adds a new line
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
