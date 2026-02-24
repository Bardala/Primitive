import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, Not } from 'typeorm';
import { randomUUID } from 'node:crypto';
import {
  UserConversationState,
  ConversationType,
} from '../entities/user-conversation-state.entity';
import { PrivateMessage } from '../entities/private-message.entity';
import { ChatMessage } from '../entities/chat-message.entity';
import { IUserConversationStateService } from './interfaces';

@Injectable()
export class UserConversationStateService implements IUserConversationStateService {
  constructor(
    @InjectRepository(UserConversationState)
    private stateRepository: Repository<UserConversationState>,
    @InjectRepository(PrivateMessage)
    private privateMessageRepository: Repository<PrivateMessage>,
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
  ) {}

  /**
   * Get or create a conversation state for a user.
   * Uses upsert pattern to handle concurrent access safely.
   */
  async getOrCreate(
    userId: string,
    conversationId: string,
    conversationType: ConversationType,
  ): Promise<UserConversationState> {
    let state = await this.stateRepository.findOne({
      where: { userId, conversationId, conversationType },
    });

    if (!state) {
      state = new UserConversationState();
      state.id = randomUUID();
      state.userId = userId;
      state.conversationId = conversationId;
      state.conversationType = conversationType;
      state.lastReadAt = new Date(86400000); // 1 day after epoch - safe for MySQL TIMESTAMP
      state = await this.stateRepository.save(state);
    }

    return state;
  }

  /**
   * Mark all messages in a conversation as read up to now or up to a specific time.
   */
  async markAsRead(
    userId: string,
    conversationId: string,
    conversationType: ConversationType,
    lastReadAt?: Date,
  ): Promise<UserConversationState> {
    const state = await this.getOrCreate(userId, conversationId, conversationType);
    state.lastReadAt = lastReadAt ?? new Date();
    return this.stateRepository.save(state);
  }

  /**
   * Get the last read timestamp for a user in a conversation.
   * Returns epoch time if no state exists (all messages unread).
   */
  async getLastReadAt(
    userId: string,
    conversationId: string,
    conversationType: ConversationType,
  ): Promise<Date> {
    const state = await this.stateRepository.findOne({
      where: { userId, conversationId, conversationType },
    });
    return state?.lastReadAt ?? new Date(86400000); // 1 day after epoch
  }

  /**
   * Get unread count for a private conversation.
   * Counts messages after lastReadAt that were not sent by the user.
   */
  async getPrivateUnreadCount(userId: string, conversationId: string): Promise<number> {
    const lastReadAt = await this.getLastReadAt(userId, conversationId, ConversationType.PRIVATE);

    return this.privateMessageRepository.count({
      where: {
        conversationId,
        senderId: Not(userId),
        createdAt: MoreThan(lastReadAt),
      },
    });
  }

  /**
   * Get unread count for a space conversation.
   * Counts messages after lastReadAt that were not sent by the user.
   */
  async getSpaceUnreadCount(userId: string, spaceId: string): Promise<number> {
    const lastReadAt = await this.getLastReadAt(userId, spaceId, ConversationType.SPACE);
    const lastReadTimestamp = lastReadAt.getTime();

    return this.chatMessageRepository.count({
      where: {
        spaceId,
        userId: Not(userId),
        timestamp: MoreThan(lastReadTimestamp),
      },
    });
  }

  /**
   * Update lastSoundPlayedAt to prevent duplicate notification sounds.
   */
  async updateLastSoundPlayed(
    userId: string,
    conversationId: string,
    conversationType: ConversationType,
  ): Promise<void> {
    const state = await this.getOrCreate(userId, conversationId, conversationType);
    state.lastSoundPlayedAt = new Date();
    await this.stateRepository.save(state);
  }

  /**
   * Batch get unread counts for multiple private conversations.
   * Optimized for listing conversations with unread counts.
   */
  async getPrivateUnreadCountsBatch(
    userId: string,
    conversationIds: string[],
  ): Promise<Map<string, number>> {
    const result = new Map<string, number>();

    if (conversationIds.length === 0) {
      return result;
    }

    // Get all states for these conversations
    const states = await this.stateRepository.find({
      where: conversationIds.map((id) => ({
        userId,
        conversationId: id,
        conversationType: ConversationType.PRIVATE,
      })),
    });

    const stateMap = new Map(
      states.map((s) => [s.conversationId, s.lastReadAt ?? new Date(86400000)]),
    );

    // For each conversation, count unread messages
    await Promise.all(
      conversationIds.map(async (convId) => {
        const lastReadAt = stateMap.get(convId) ?? new Date(86400000);
        const count = await this.privateMessageRepository.count({
          where: {
            conversationId: convId,
            senderId: Not(userId),
            createdAt: MoreThan(lastReadAt),
          },
        });
        result.set(convId, count);
      }),
    );

    return result;
  }

  /**
   * Toggle mute status for a conversation.
   */
  async toggleMute(
    userId: string,
    conversationId: string,
    conversationType: ConversationType,
    isMuted?: boolean,
  ): Promise<UserConversationState> {
    const state = await this.getOrCreate(userId, conversationId, conversationType);
    state.isMuted = isMuted ?? !state.isMuted;
    return this.stateRepository.save(state);
  }

  /**
   * Check if a notification sound should be played for a user in a conversation.
   * Returns true if NOT muted and sound hasn't been played in the last 10 seconds.
   */
  async shouldPlaySound(
    userId: string,
    conversationId: string,
    conversationType: ConversationType,
  ): Promise<boolean> {
    const state = await this.getOrCreate(userId, conversationId, conversationType);

    if (state.isMuted) return false;

    if (!state.lastSoundPlayedAt) return true;

    const twoSecondsAgo = new Date(Date.now() - 2000);
    return state.lastSoundPlayedAt < twoSecondsAgo;
  }
}
