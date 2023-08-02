import { ChatReq, ChatRes, CreateMsgReq, CreateMsgRes, ENDPOINT, Space } from '@nest/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';

import { useAuthContext } from '../context/AuthContext';
import { fetchFn } from '../fetch';
import { ApiError } from '../fetch/auth';

export const Chat: React.FC<{ space: Space }> = ({ space }) => {
  const { currUser } = useAuthContext();
  const [newMsg, setNewMsg] = useState('');
  const queryClient = useQueryClient();

  const chatQuery = useQuery<ChatRes, ApiError>(
    ['chat', space.id],
    () =>
      fetchFn<ChatReq, ChatRes>(ENDPOINT.Get_SPACE_CHAT, 'GET', undefined, currUser?.jwt, [
        space.id,
      ]),
    {
      enabled: !!currUser?.jwt && !!space.id,
    }
  );
  const chatErr = chatQuery.error;

  const msgMutate = useMutation<CreateMsgRes, ApiError>(
    () =>
      fetchFn<CreateMsgReq, CreateMsgRes>(
        ENDPOINT.CREATE_MESSAGE,
        'POST',
        { content: newMsg },
        currUser?.jwt,
        [space.id]
      ),
    {
      onSuccess: data => {
        queryClient.invalidateQueries(['chat', space.id]);
        setNewMsg('');
      },
      onError: err => console.error(err),
    }
  );

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
              <p>{msg.username}</p>
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
