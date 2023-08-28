import { ChatRes, CreateMsgRes, Space } from '@nest/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

import { useAuthContext } from '../context/AuthContext';
import { ApiError } from '../fetch/auth';
import { chatApi, createMsgApi } from '../utils/api';
import { socket } from '../utils/socket';

export const useChat = (space: Space) => {
  const [newMsg, setNewMsg] = useState('');
  const { currUser } = useAuthContext();
  const queryClient = useQueryClient();
  const chatKey = useMemo(() => ['chat', space.id], [space.id]);

  const chatQuery = useQuery<ChatRes, ApiError>(chatKey, chatApi(space.id), {
    enabled: !!currUser?.jwt && !!space.id,
  });
  const chatErr = chatQuery.error;

  useEffect(() => {
    socket.emit('join_room', space.id);

    socket.on('from_server', msg => {
      console.log('from_server', msg);
      queryClient.invalidateQueries(chatKey);
    });
  }, [space.id, queryClient, chatKey]);

  const msgMutate = useMutation<CreateMsgRes, ApiError>(createMsgApi(newMsg, space.id), {
    onSuccess: data => {
      queryClient.invalidateQueries(chatKey);
      socket.emit('from_client', { message: data.message, spaceId: space.id });
      setNewMsg('');
    },
    onError: err => console.error(err),
  });

  return { chatQuery, chatErr, msgMutate, setNewMsg, newMsg };
};
