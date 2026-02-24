import { socket } from '@/core/utils';

import { PrivateMessage, SOCKET_EVENT } from '@nest/shared';

/**
 * Private Chat WebSocket API
 * Handles real-time messaging operations via Socket.IO
 */
export const PrivateChatSocketApi = {
  /**
   * Join a private conversation room for real-time updates
   * @param conversationId - ID of the conversation to join
   */
  joinConversation: (conversationId: string): void => {
    socket.emit(SOCKET_EVENT.JOIN_PRIVATE_CONVO, { conversationId });
  },

  /**
   * Leave a private conversation room
   * @param conversationId - ID of the conversation to leave
   */
  leaveConversation: (conversationId: string): void => {
    socket.emit('LEAVE_PRIVATE_CONVO', { conversationId });
  },

  /**
   * Send a private message via WebSocket
   * The backend will create the message and broadcast to all participants
   * @param conversationId - ID of the conversation
   * @param content - Message content
   * @param toUserId - Recipient user ID
   * @returns Promise that resolves when the message is acknowledged by the server
   */
  sendMessage: (
    conversationId: string,
    content: string,
    toUserId: string
  ): Promise<PrivateMessage> => {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        socket.off(SOCKET_EVENT.PRIVATE_MSG, messageHandler);
        socket.off('error', errorHandler);
        reject(new Error('Message send timeout'));
      }, 10000); // 10 second timeout

      const messageHandler = (message: PrivateMessage) => {
        // Only resolve if this is our message (optimistic matching by content and conversation)
        if (message.conversationId === conversationId && message.content === content) {
          clearTimeout(timeout);
          socket.off(SOCKET_EVENT.PRIVATE_MSG, messageHandler);
          socket.off('error', errorHandler);
          resolve(message);
        }
      };

      const errorHandler = (error: { message: string }) => {
        clearTimeout(timeout);
        socket.off(SOCKET_EVENT.PRIVATE_MSG, messageHandler);
        socket.off('error', errorHandler);
        reject(new Error(error.message || 'Failed to send message'));
      };

      // Listen for the message to come back (confirmation)
      socket.once(SOCKET_EVENT.PRIVATE_MSG, messageHandler);
      socket.once('error', errorHandler);

      // Emit the message
      socket.emit(SOCKET_EVENT.PRIVATE_MSG, {
        conversationId,
        content,
        toUserId,
      });
    });
  },

  /**
   * Listen for incoming private messages
   * @param callback - Function to call when a message is received
   * @returns Cleanup function to remove the listener
   */
  onMessage: (callback: (message: PrivateMessage) => void): (() => void) => {
    socket.on(SOCKET_EVENT.PRIVATE_MSG, callback);
    return () => {
      socket.off(SOCKET_EVENT.PRIVATE_MSG, callback);
    };
  },

  /**
   * Listen for private message notifications (when not in conversation)
   * @param callback - Function to call when a notification is received
   * @returns Cleanup function to remove the listener
   */
  onNotification: (
    callback: (data: { type: string; message: PrivateMessage; conversationId: string }) => void
  ): (() => void) => {
    const handler = (data: any) => {
      if (data.type === 'PRIVATE_MESSAGE_NEW') {
        callback(data);
      }
    };
    socket.on(SOCKET_EVENT.NOTIFICATION, handler);
    return () => {
      socket.off(SOCKET_EVENT.NOTIFICATION, handler);
    };
  },

  /**
   * Listen for read receipts (when recipient reads messages)
   */
  onReadReceipt: (
    callback: (data: { conversationId: string; readByUserId: string; readAt: Date }) => void
  ): (() => void) => {
    socket.on('PRIVATE_MSG_READ', callback);
    return () => {
      socket.off('PRIVATE_MSG_READ', callback);
    };
  },

  /**
   * Listen for user online/offline status changes
   */
  onUserStatusChange: (
    callback: (data: { userId: string; isOnline: boolean; lastActive?: string | Date }) => void
  ): (() => void) => {
    socket.on('USER_STATUS_CHANGE', callback);
    return () => {
      socket.off('USER_STATUS_CHANGE', callback);
    };
  },
};
