import { getFn, postFn } from '@/core/services';

import {
  CreatePrivateConvoReq,
  ENDPOINT,
  GetConversationsRes,
  PrivateConversation,
  PrivateMessage,
} from '@nest/shared';

/**
 * Private Chat REST API
 * Handles HTTP requests for private messaging (non-real-time operations)
 *
 * Note: For sending messages, use PrivateChatSocketApi instead (WebSocket-based)
 */
export const PrivateChatApi = {
  /**
   * Get all conversations for the current user
   * Includes otherUser info, lastMessage, and unreadCount
   */
  getConversations: () => getFn<GetConversationsRes>(ENDPOINT.GET_PRIVATE_CONVERSATIONS),

  /**
   * Get messages for a specific conversation
   * Backend returns PrivateMessage[] directly (not wrapped in object)
   */
  getMessages: (conversationId: string, limit = 20, offset = 0) =>
    getFn<PrivateMessage[]>(ENDPOINT.GET_PRIVATE_MESSAGES, [conversationId], null, {
      limit,
      offset,
    }),

  /**
   * Create a new private conversation with another user
   * Returns existing conversation if one already exists
   */
  createConversation: (data: CreatePrivateConvoReq) =>
    postFn<CreatePrivateConvoReq, PrivateConversation>(ENDPOINT.CREATE_PRIVATE_CONVERSATION, data),

  /**
   * Mark all messages in a conversation as read
   * Updates the UserConversationState.lastReadAt timestamp
   */
  markAsRead: (conversationId: string, lastReadId?: string) =>
    postFn<{ lastReadId?: string }, { success: boolean }>(
      ENDPOINT.MARK_PRIVATE_CHAT_AS_READ,
      { lastReadId },
      [conversationId]
    ),

  // NOTE: sendMessage has been removed - use PrivateChatSocketApi.sendMessage() instead
  // Messages are now sent exclusively via WebSocket for real-time delivery
};
