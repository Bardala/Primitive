import { ApiError } from '@/core/services';

import {
  CreatePrivateConvoReq,
  GetConversationsRes,
  PrivateConversation,
  PrivateMessage,
} from '@nest/shared';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';

import { PrivateChatSocketApi } from '../api/private-chat-socket.api';
import { PrivateChatApi } from '../api/private-chat.api';

// Query keys for cache management
export const PRIVATE_CHAT_KEYS = {
  conversations: ['private-conversations'] as const,
  messages: (conversationId: string) => ['private-messages', conversationId] as const,
};

/**
 * Hook to fetch all private conversations for the current user
 * Includes real-time updates when new messages arrive
 */
export const usePrivateConversations = () => {
  const queryClient = useQueryClient();

  // Listen for new message notifications to update unread counts
  useEffect(() => {
    const cleanup = PrivateChatSocketApi.onNotification(data => {
      // Invalidate conversations to refresh unread counts
      void queryClient.invalidateQueries(PRIVATE_CHAT_KEYS.conversations);
    });

    return cleanup;
  }, [queryClient]);

  // Listen for read receipts to update message status
  useEffect(() => {
    const cleanup = PrivateChatSocketApi.onReadReceipt(data => {
      queryClient.setQueryData<GetConversationsRes>(PRIVATE_CHAT_KEYS.conversations, oldData => {
        if (!oldData) return oldData;
        return {
          conversations: oldData.conversations.map((c: any) => {
            if (c.id === data.conversationId) {
              return {
                ...c,
                otherUserLastReadAt: data.readAt,
              };
            }
            return c;
          }),
        };
      });
    });
    return cleanup;
  }, [queryClient]);

  // Listen for user online/offline status changes
  useEffect(() => {
    const cleanup = PrivateChatSocketApi.onUserStatusChange(data => {
      queryClient.setQueryData<GetConversationsRes>(PRIVATE_CHAT_KEYS.conversations, oldData => {
        if (!oldData) return oldData;
        return {
          conversations: oldData.conversations.map((c: any) => {
            if (c.otherUser.id === data.userId) {
              return {
                ...c,
                otherUser: {
                  ...c.otherUser,
                  isOnline: data.isOnline,
                  lastSeen: data.lastActive || c.otherUser.lastSeen,
                  activity: data.lastActive
                    ? {
                        ...c.otherUser.activity,
                        lastActive: data.lastActive,
                      }
                    : c.otherUser.activity,
                },
              };
            }
            return c;
          }),
        };
      });
    });
    return cleanup;
  }, [queryClient]);

  return useQuery<GetConversationsRes, ApiError>(
    PRIVATE_CHAT_KEYS.conversations,
    () => PrivateChatApi.getConversations(),
    {
      staleTime: 30000, // 30 seconds
      refetchOnWindowFocus: true,
    }
  );
};

/**
 * Hook to fetch messages for a specific conversation
 * Includes real-time updates via WebSocket
 */
export const usePrivateMessages = (conversationId: string) => {
  const queryClient = useQueryClient();

  // Join the private conversation room for real-time updates
  useEffect(() => {
    if (!conversationId) return;

    // Join the conversation room
    PrivateChatSocketApi.joinConversation(conversationId);

    // Handle incoming messages
    const cleanup = PrivateChatSocketApi.onMessage(message => {
      // Only update if message belongs to this conversation
      if (message.conversationId !== conversationId) return;

      queryClient.setQueryData<PrivateMessage[]>(
        PRIVATE_CHAT_KEYS.messages(conversationId),
        oldData => {
          if (!oldData) return [message];
          // Avoid duplicates
          if (oldData.some(m => m.id === message.id)) return oldData;
          // Add to beginning (newest first, as that's how API returns them)
          return [message, ...oldData];
        }
      );
      // Also refresh conversations to update lastMessage
      void queryClient.invalidateQueries(PRIVATE_CHAT_KEYS.conversations);
    });

    return () => {
      cleanup();
      PrivateChatSocketApi.leaveConversation(conversationId);
    };
  }, [conversationId, queryClient]);

  return useQuery<PrivateMessage[], ApiError>(
    PRIVATE_CHAT_KEYS.messages(conversationId),
    () => PrivateChatApi.getMessages(conversationId),
    {
      enabled: !!conversationId,
      staleTime: 10000, // 10 seconds
    }
  );
};

/**
 * Hook to create a new private conversation
 */
export const useCreatePrivateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation<PrivateConversation, ApiError, CreatePrivateConvoReq>(
    data => PrivateChatApi.createConversation(data),
    {
      onSuccess: () => {
        void queryClient.invalidateQueries(PRIVATE_CHAT_KEYS.conversations);
      },
    }
  );
};

/**
 * Hook to send a private message via WebSocket
 * Messages are sent in real-time and don't use HTTP
 */
export const useSendPrivateMessage = (conversationId: string, toUserId?: string) => {
  const queryClient = useQueryClient();

  return useMutation<
    PrivateMessage,
    Error,
    { content: string },
    { optimisticMessage: PrivateMessage } | undefined
  >(
    async ({ content }) => {
      if (!toUserId) {
        throw new Error('Recipient user ID is required');
      }

      // Send message via WebSocket - backend creates it and broadcasts
      const message = await PrivateChatSocketApi.sendMessage(conversationId, content, toUserId);

      return message;
    },
    {
      onMutate: async ({ content }) => {
        // Optimistic update - immediately show the message
        const tempId = `temp-${Date.now()}`;
        const currentUserId = localStorage.getItem('CURR_USER');
        let senderId = 'unknown';

        if (currentUserId) {
          try {
            senderId = JSON.parse(currentUserId).id;
          } catch {
            // ignore
          }
        }

        const optimisticMessage: PrivateMessage = {
          id: tempId,
          conversationId,
          senderId,
          content,
          createdAt: new Date(),
        };

        queryClient.setQueryData<PrivateMessage[]>(
          PRIVATE_CHAT_KEYS.messages(conversationId),
          oldData => {
            if (!oldData) return [optimisticMessage];
            return [optimisticMessage, ...oldData];
          }
        );

        return { optimisticMessage };
      },
      onSuccess: (message, _variables, context) => {
        // Remove optimistic message and replace with real one
        queryClient.setQueryData<PrivateMessage[]>(
          PRIVATE_CHAT_KEYS.messages(conversationId),
          oldData => {
            if (!oldData) return [message];
            // Remove temp message, add real one (avoid duplicates)
            const filtered = oldData.filter(m => m.id !== context?.optimisticMessage.id);
            if (filtered.some(m => m.id === message.id)) return filtered;
            return [message, ...filtered];
          }
        );

        // Refresh conversations to update lastMessage
        void queryClient.invalidateQueries(PRIVATE_CHAT_KEYS.conversations);
      },
      onError: (_error, _variables, context) => {
        // Remove optimistic message on error
        if (context?.optimisticMessage) {
          queryClient.setQueryData<PrivateMessage[]>(
            PRIVATE_CHAT_KEYS.messages(conversationId),
            oldData => {
              if (!oldData) return [];
              return oldData.filter(m => m.id !== context.optimisticMessage.id);
            }
          );
        }
      },
    }
  );
};

/**
 * Hook to mark a conversation as read
 * Call this when user views a conversation
 */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  const markAsRead = useCallback(
    async (conversationId: string) => {
      try {
        await PrivateChatApi.markAsRead(conversationId);
        // Refresh conversations to update unread counts
        void queryClient.invalidateQueries(PRIVATE_CHAT_KEYS.conversations);
      } catch (error) {
        console.error('Failed to mark conversation as read:', error);
      }
    },
    [queryClient]
  );

  return { markAsRead };
};

/**
 * Hook to get the other user's ID from a conversation
 * Useful for sending WebSocket messages
 */
export const useGetOtherUserId = (conversationId: string) => {
  const { data: conversationsData } = usePrivateConversations();

  const conversation = conversationsData?.conversations.find(c => c.id === conversationId);
  return conversation?.otherUser?.id;
};
