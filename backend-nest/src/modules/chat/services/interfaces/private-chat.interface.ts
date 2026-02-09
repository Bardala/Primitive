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
  getDecoratedConversations(userId: string): Promise<any[]>;
}
