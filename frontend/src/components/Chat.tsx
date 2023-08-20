import { Space } from '@nest/shared';
import formatDistantToNow from 'date-fns/formatDistanceToNow';
import { FormEvent } from 'react';

import { useChat } from '../hooks/useChat';

export const Chat: React.FC<{ space: Space }> = ({ space }) => {
  const { msgMutate, chatQuery, chatErr, setNewMsg, newMsg } = useChat(space);

  const handleSubmit = (e: FormEvent | MouseEvent) => {
    e.preventDefault();
    msgMutate.mutate();
  };

  if (chatErr) return <p className="error">{chatErr.message}</p>;
  return (
    <>
      {msgMutate.isError && <p className="error">{msgMutate.error?.message}</p>}
      <div className="space-chat">
        <ul className="space-chat-msgs">
          {chatQuery.data?.messages.map(msg => (
            <li key={msg.id}>
              <p>{msg.content}</p>
              <p>
                {msg.username}
                {',  '}
                {formatDistantToNow(new Date(msg?.timestamp as number), { addSuffix: true })}
              </p>
            </li>
          ))}
        </ul>

        <form onSubmit={handleSubmit} className="msg-form">
          <input
            type="text"
            value={newMsg}
            onChange={e => setNewMsg(e.target.value)}
            placeholder="send message"
          />
          <button type="submit" className="send-msg">
            Send
          </button>
        </form>
      </div>
    </>
  );
};
