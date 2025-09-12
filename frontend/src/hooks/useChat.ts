import { ChatRes, CreateMsgRes, Space } from '@nest/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';

import { HOST } from '../config';
import { useAuthContext } from '../context/AuthContext';
import { ApiError } from '../fetch/auth';
import { chatApi, createMsgApi } from '../utils/api';

const socket = io(HOST);
export const useChat = (space: Space) => {
  const [newMsg, setNewMsg] = useState('');
  const { currUser } = useAuthContext();
  const queryClient = useQueryClient();
  const chatKey = useMemo(() => ['chat', space.id], [space.id]);

  const chatQuery = useQuery<ChatRes, ApiError>(chatKey, chatApi(space.id), {
    enabled: !!currUser?.jwt && !!space.id,
    refetchOnWindowFocus: false,
  });
  const chatErr = chatQuery.error;

  useEffect(() => {
    socket.emit('join_room', space.id);

    // When we receive a new message from the server, update the query data
    socket.on('from_server', msg => {
      queryClient.setQueryData<ChatRes>(chatKey, oldData => {
        if (!oldData) return oldData;
        if (oldData.messages.some(m => m.id === msg.id)) return oldData;
        return { messages: [msg, ...oldData.messages] };
      });
    });
  }, [space.id, queryClient, chatKey]);

  const msgMutate = useMutation<CreateMsgRes, ApiError>(createMsgApi(newMsg, space.id), {
    onSuccess: data => {
      queryClient.setQueryData<ChatRes>(chatKey, oldData => {
        if (!oldData) return { messages: [data.message] };
        // Prepend the new message
        return { messages: [data.message, ...oldData.messages] };
      });
      socket.emit('from_client', { message: data.message, spaceId: space.id });
      setNewMsg('');
    },
  });

  return { chatQuery, chatErr, msgMutate, setNewMsg, newMsg };
};
