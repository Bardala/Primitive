import { ChatReq, ChatRes, CreateMsgReq, CreateMsgRes, ENDPOINT, Space } from '@nest/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { useAuthContext } from '../context/AuthContext';
import { fetchFn } from '../fetch';
import { ApiError } from '../fetch/auth';
import { socket } from '../utils/socket';

export const useChat = (space: Space) => {
  const [newMsg, setNewMsg] = useState('');

  const { currUser } = useAuthContext();
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

  useEffect(() => {
    socket.emit('join_room', space.id);

    socket.on('from_server', msg => {
      console.log('from_server', msg);
      queryClient.invalidateQueries(['chat', space.id]);
    });
  }, [space.id, queryClient]);

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
        socket.emit('from_client', { message: data.message, spaceId: space.id });
        setNewMsg('');
      },
      onError: err => console.error(err),
    }
  );

  return { chatQuery, chatErr, msgMutate, setNewMsg, newMsg };
};
