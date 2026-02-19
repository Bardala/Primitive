import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { PrivateConversation, PrivateMessage } from '../entities';
import {
  GetConversationsRes,
  type PrivateConversation as IPrivateConversation,
  type PrivateMessage as IPrivateMessage,
} from '@nest/shared';
import { IPrivateChatService } from './interfaces';
import { UserConversationStateService } from './user-conversation-state.service';
import { ConversationType } from '../entities/user-conversation-state.entity';

import { PresenceService } from '../../presence/presence.service';

@Injectable()
export class PrivateChatService implements IPrivateChatService {
  constructor(
    @InjectRepository(PrivateConversation)
    private conversationRepository: Repository<PrivateConversation>,
    @InjectRepository(PrivateMessage)
    private messageRepository: Repository<PrivateMessage>,
    private userConversationStateService: UserConversationStateService,
    private presenceService: PresenceService,
  ) {}

  async createConversation(user1Id: string, user2Id: string): Promise<IPrivateConversation> {
    if (user1Id === user2Id) {
      throw new BadRequestException('Cannot start conversation with yourself');
    }

    // Check if conversation already exists
    const existing = await this.conversationRepository.findOne({
      where: [
        { user1Id, user2Id },
        { user1Id: user2Id, user2Id: user1Id },
      ],
    });

    if (existing) {
      return existing;
    }

    const conversation = new PrivateConversation();
    conversation.id = randomUUID();
    conversation.user1Id = user1Id;
    conversation.user2Id = user2Id;

    const saved = await this.conversationRepository.save(conversation);

    // Initialize conversation state for both users
    await Promise.all([
      this.userConversationStateService.getOrCreate(user1Id, saved.id, ConversationType.PRIVATE),
      this.userConversationStateService.getOrCreate(user2Id, saved.id, ConversationType.PRIVATE),
    ]);

    return saved;
  }

  async getConversations(userId: string): Promise<GetConversationsRes> {
    const conversations = await this.conversationRepository.find({
      where: [{ user1Id: userId }, { user2Id: userId }],
      relations: ['user1', 'user1.activity', 'user2', 'user2.activity'],
    });

    // Get unread counts in batch for efficiency
    const conversationIds = conversations.map((c) => c.id);
    const unreadCounts = await this.userConversationStateService.getPrivateUnreadCountsBatch(
      userId,
      conversationIds,
    );

    const decoratedConversations = await Promise.all(
      conversations.map(async (c) => {
        const otherUser = c.user1Id === userId ? c.user2 : c.user1;
        const lastMessage = await this.messageRepository.findOne({
          where: { conversationId: c.id },
          order: { createdAt: 'DESC' },
        });

        const otherUserLastReadAt = await this.userConversationStateService.getLastReadAt(
          otherUser.id,
          c.id,
          ConversationType.PRIVATE,
        );

        // Set real-time online status
        const isOnline = this.presenceService.isOnline(otherUser.id);

        const state = await this.userConversationStateService.getOrCreate(
          userId,
          c.id,
          ConversationType.PRIVATE,
        );

        return {
          ...c,
          otherUser: {
            ...otherUser,
            isOnline,
            lastSeen: otherUser.activity?.lastActive,
          },
          lastMessage: lastMessage ?? undefined,
          unreadCount: unreadCounts.get(c.id) ?? 0,
          otherUserLastReadAt,
          isMuted: state.isMuted,
        };
      }),
    );

    // Sort by last message date (most recent first)
    decoratedConversations.sort((a, b) => {
      const dateA = a.lastMessage?.createdAt || a.createdAt;
      const dateB = b.lastMessage?.createdAt || b.createdAt;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

    return { conversations: decoratedConversations };
  }

  async createMessage(
    conversationId: string,
    senderId: string,
    content: string,
  ): Promise<IPrivateMessage> {
    if (!content) {
      throw new BadRequestException('Message content is required');
    }

    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.user1Id !== senderId && conversation.user2Id !== senderId) {
      throw new ForbiddenException('You are not a participant in this conversation');
    }

    const message = new PrivateMessage();
    message.id = randomUUID();
    message.conversationId = conversationId;
    message.senderId = senderId;
    message.content = content;
    message.createdAt = new Date();

    await this.messageRepository.save(message);

    // Auto-mark as read for sender
    await this.userConversationStateService.markAsRead(
      senderId,
      conversationId,
      ConversationType.PRIVATE,
    );

    return message;
  }

  async getMessages(
    conversationId: string,
    userId: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<IPrivateMessage[]> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.user1Id !== userId && conversation.user2Id !== userId) {
      throw new ForbiddenException('You are not a participant in this conversation');
    }

    return await this.messageRepository.find({
      where: { conversationId },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
      relations: ['sender'],
    });
  }

  /**
   * Mark all messages in a conversation as read for a user.
   */
  async markAsRead(userId: string, conversationId: string, lastReadId?: string): Promise<void> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.user1Id !== userId && conversation.user2Id !== userId) {
      throw new ForbiddenException('You are not a participant in this conversation');
    }

    let lastReadAt: Date | undefined;
    if (lastReadId) {
      const msg = await this.messageRepository.findOne({ where: { id: lastReadId } });
      if (msg) {
        lastReadAt = msg.createdAt;
      }
    }

    await this.userConversationStateService.markAsRead(
      userId,
      conversationId,
      ConversationType.PRIVATE,
      lastReadAt,
    );
  }

  /**
   * Get unread count for a specific conversation.
   */
  async getUnreadCount(userId: string, conversationId: string): Promise<number> {
    return this.userConversationStateService.getPrivateUnreadCount(userId, conversationId);
  }

  // Legacy method - kept for backward compatibility but now uses actual unread counts
  async getDecoratedConversations(userId: string): Promise<any[]> {
    const result = await this.getConversations(userId);
    return result.conversations;
  }

  /**
   * Toggle mute status for a private conversation.
   */
  async toggleMute(userId: string, conversationId: string, isMuted?: boolean): Promise<void> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.user1Id !== userId && conversation.user2Id !== userId) {
      throw new ForbiddenException('Not a participant in this conversation');
    }

    await this.userConversationStateService.toggleMute(
      userId,
      conversationId,
      ConversationType.PRIVATE,
      isMuted,
    );
  }

  async updateLastSoundPlayed(userId: string, conversationId: string): Promise<void> {
    await this.userConversationStateService.updateLastSoundPlayed(
      userId,
      conversationId,
      ConversationType.PRIVATE,
    );
  }
}
