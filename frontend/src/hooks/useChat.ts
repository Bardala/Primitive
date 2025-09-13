import { ChatRes, CreateMsgRes, SOCKET_EVENT, Space } from '@nest/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { socket } from 'src/socket';

import { useAuthContext } from '../context/AuthContext';
import { ApiError } from '../fetch/auth';
import { chatApi, createMsgApi } from '../utils/api';

export const useChat = (space: Space) => {
  const [newMsg, setNewMsg] = useState('');
  const { currUser } = useAuthContext();
  const queryClient = useQueryClient();
  const chatKey = useMemo(() => ['chat', space.id], [space.id]);

  const chatQuery = useQuery<ChatRes, ApiError>(chatKey, chatApi(space.id), {
    enabled: !!currUser?.jwt && !!space.id,
    refetchOnReconnect: true,
  });
  const chatErr = chatQuery.error;

  useEffect(() => {
    socket.emit(SOCKET_EVENT.JOIN_ROOM, { spaceId: space.id, userId: currUser?.id });

    // When we receive a new message from the server, update the query data
    socket.on(SOCKET_EVENT.FROM_SERVER, msg => {
      queryClient.setQueryData<ChatRes>(chatKey, oldData => {
        if (!oldData) return oldData;
        if (oldData.messages.some(m => m.id === msg.id)) return oldData;
        return { messages: [msg, ...oldData.messages] };
      });
    });
  }, [space.id, queryClient, chatKey, currUser?.id]);

  const msgMutate = useMutation<CreateMsgRes, ApiError>(createMsgApi(newMsg, space.id), {
    onSuccess: data => {
      queryClient.setQueryData<ChatRes>(chatKey, oldData => {
        if (!oldData) return { messages: [data.message] };

        return { messages: [data.message, ...oldData.messages] };
      });
      socket.emit(SOCKET_EVENT.FROM_CLIENT, { message: data.message });
      setNewMsg('');
    },
  });

  return { chatQuery, chatErr, msgMutate, setNewMsg, newMsg };
};
