import { Space } from '@nest/shared';
import formatDistantToNow from 'date-fns/formatDistanceToNow';
import { FormEvent } from 'react';
import { BiSend } from 'react-icons/bi';

import { useAuthContext } from '../context/AuthContext';
import { useChat } from '../hooks/useChat';

// todo: add infinite scroll
export const Chat: React.FC<{ space: Space }> = ({ space }) => {
  const { currUser } = useAuthContext();
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
              <p style={msg.userId === currUser?.id ? { backgroundColor: '#bbd7ff' } : {}}>
                {msg.content}
              </p>
              <p>
                <strong>{msg.username}</strong>
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
            placeholder="write message"
          />
          <button
            type="submit"
            className="send-msg"
            disabled={msgMutate.isLoading || newMsg.length === 0}
          >
            <BiSend />
          </button>
        </form>
      </div>
    </>
  );
};
