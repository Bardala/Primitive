import { useAuthContext } from '@/core/context';
import { ApiError } from '@/core/services';
import { chatApi, createMsgApi, socket } from '@/core/utils';

import {
  ChatMessage,
  ChatRes,
  CreateMsgRes,
  CreateSocketMsgReq,
  SOCKET_EVENT,
  Space,
} from '@nest/shared';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

const useGetSpcMsgs = (spaceId: string) => {
  const chatKey = useMemo(() => ['chat', spaceId], [spaceId]);

  return useQuery<ChatRes, ApiError>(chatKey, chatApi(spaceId), {
    enabled: !!spaceId,
    refetchOnReconnect: true,
  });
};

const useCreateSpcMsg = (spaceId: string, newMsg: string) => {
  const chatKey = useMemo(() => ['chat', spaceId], [spaceId]);
  const queryClient = useQueryClient();

  return useMutation<CreateMsgRes, ApiError>(createMsgApi(newMsg, spaceId), {
    onSuccess: data => {
      queryClient.setQueryData<ChatRes>(chatKey, oldData => {
        if (!oldData) return { messages: [data.message] };
        return { messages: [data.message, ...oldData.messages] };
      });
      socket.emit(SOCKET_EVENT.FROM_CLIENT, { message: data.message });
    },
  });
};

export const useSendSpcMsg = () => {
  return useMutation<void, Error, CreateSocketMsgReq>(async payload => {
    socket.emit(SOCKET_EVENT.FROM_CLIENT, payload);
  });
};

export const useChat = (space: Space) => {
  const [newMsg, setNewMsg] = useState('');
  const { currUser } = useAuthContext();
  const queryClient = useQueryClient();
  const chatKey = useMemo(() => ['chat', space.id], [space.id]);

  const chatQuery = useGetSpcMsgs(space.id);
  const chatErr = chatQuery.error;

  useEffect(() => {
    socket.emit(SOCKET_EVENT.JOIN_ROOM, { spaceId: space.id, userId: currUser?.id });

    const handler = (msg: ChatMessage) => {
      queryClient.setQueryData<ChatRes>(chatKey, oldData => {
        if (!oldData) return { messages: [msg] };
        if (oldData.messages.some(m => m.id === msg.id)) return oldData;
        return { messages: [msg, ...oldData.messages] };
      });
    };

    socket.on(SOCKET_EVENT.FROM_SERVER, handler);

    return () => {
      socket.off(SOCKET_EVENT.FROM_SERVER, handler);
    };
  }, [space.id, queryClient, chatKey, currUser?.id]);

  const msgMutate = useSendSpcMsg();
  // msgMutate.mutate({ spaceId: space.id, content: newMsg });
  // if (msgMutate.isSuccess) setNewMsg('');

  return { chatQuery, chatErr, msgMutate, setNewMsg, newMsg };
};
