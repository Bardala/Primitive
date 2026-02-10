import { PrivateConversation, PrivateMessage } from '@nest/shared';

/**
 * IPrivateChatService interface
 * Responsibility: Handle private messaging between users
 */
export interface IPrivateChatService {
  createConversation(user1Id: string, user2Id: string): Promise<PrivateConversation>;
  createMessage(conversationId: string, senderId: string, content: string): Promise<PrivateMessage>;
  getMessages(
    conversationId: string,
    userId: string,
    limit: number,
    offset: number,
  ): Promise<PrivateMessage[]>;
  getConversations(userId: string): Promise<any>;
  markAsRead(userId: string, conversationId: string, lastReadId?: string): Promise<void>;
  getDecoratedConversations(userId: string): Promise<any[]>;
  toggleMute(userId: string, conversationId: string, isMuted?: boolean): Promise<void>;
}
