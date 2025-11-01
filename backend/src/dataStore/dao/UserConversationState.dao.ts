import { ConversationType, UserConversationState } from '@nest/shared';

export interface UserConversationStateDao {
  markConversationAsRead(params: {
    userId: string;
    conversationId: string;
    conversationType: ConversationType;
    lastReadAt: string;
  }): Promise<void>;

  updateLastSoundPlayed(params: {
    userId: string;
    conversationId: string;
    conversationType: ConversationType;
    lastSoundPlayedAt: string;
  }): Promise<void>;

  getUserConversationState(
    userId: string,
    conversationId: string,
    conversationType: ConversationType
  ): Promise<UserConversationState | undefined>;

  getUserAllConversationStates(userId: string): Promise<UserConversationState[]>;
  deleteUserConversationState(
    userId: string,
    conversationId: string,
    conversationType: ConversationType
  ): Promise<void>;

  getUnreadConversations(userId: string): Promise<UserConversationState[]>;
}
