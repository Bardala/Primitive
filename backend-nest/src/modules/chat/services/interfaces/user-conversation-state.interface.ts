import { UserConversationState } from '../../entities/user-conversation-state.entity';
import { ConversationType } from '../../entities/user-conversation-state.entity';

/**
 * IUserConversationStateService interface
 * Responsibility: Track user conversation states for read tracking and notifications
 */
export interface IUserConversationStateService {
  /**
   * Get or create a conversation state for a user.
   */
  getOrCreate(
    userId: string,
    conversationId: string,
    conversationType: ConversationType,
  ): Promise<UserConversationState>;

  /**
   * Mark all messages in a conversation as read up to now or up to a specific time.
   */
  markAsRead(
    userId: string,
    conversationId: string,
    conversationType: ConversationType,
    lastReadAt?: Date,
  ): Promise<UserConversationState>;

  /**
   * Get the last read timestamp for a user in a conversation.
   */
  getLastReadAt(
    userId: string,
    conversationId: string,
    conversationType: ConversationType,
  ): Promise<Date>;

  /**
   * Get unread count for a private conversation.
   */
  getPrivateUnreadCount(userId: string, conversationId: string): Promise<number>;

  /**
   * Get unread count for a space conversation.
   */
  getSpaceUnreadCount(userId: string, spaceId: string): Promise<number>;

  /**
   * Update lastSoundPlayedAt to prevent duplicate notification sounds.
   */
  updateLastSoundPlayed(
    userId: string,
    conversationId: string,
    conversationType: ConversationType,
  ): Promise<void>;

  /**
   * Batch get unread counts for multiple private conversations.
   */
  getPrivateUnreadCountsBatch(
    userId: string,
    conversationIds: string[],
  ): Promise<Map<string, number>>;
  /**
   * Toggle mute status for a conversation.
   */
  toggleMute(
    userId: string,
    conversationId: string,
    conversationType: ConversationType,
    isMuted?: boolean,
  ): Promise<UserConversationState>;

  /**
   * Check if a notification sound should be played for a user in a conversation.
   */
  shouldPlaySound(
    userId: string,
    conversationId: string,
    conversationType: ConversationType,
  ): Promise<boolean>;
}
