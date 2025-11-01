import { PrivateConversation } from '@nest/shared';

export interface PrivateConversationDao {
  createConversation(conversation: PrivateConversation): Promise<void>;
  getConversation(conversationId: string): Promise<PrivateConversation | undefined>;
  getConversationByUsers(
    user1Id: string,
    user2Id: string
  ): Promise<PrivateConversation | undefined>;
  getUserConversations(userId: string): Promise<PrivateConversation[]>;
  deleteConversation(conversationId: string): Promise<void>;
}
