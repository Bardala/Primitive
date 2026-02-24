import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { ChatMessage } from '../entities/chat-message.entity';
import { ChatRepository } from '../repositories/chat.repository';
import { CreateMsgReq, CreateMsgRes } from '../dto/create-message.dto';
import { DeleteMsgRes } from '../dto/delete-message.dto';
import { Space } from 'src/modules/space/entities/space.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Member } from 'src/modules/space/entities/member.entity';
import { IChatService } from './interfaces';
import { UserConversationStateService } from './user-conversation-state.service';
import { ConversationType } from '../entities/user-conversation-state.entity';

@Injectable()
export class ChatService implements IChatService {
  constructor(
    private chatRepository: ChatRepository,
    @InjectRepository(Space)
    private spaceRepository: Repository<Space>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    private userConversationStateService: UserConversationStateService,
  ) {}

  async createMessage(userId: string, spaceId: string, req: CreateMsgReq): Promise<CreateMsgRes> {
    if (!spaceId) {
      throw new BadRequestException('Space ID is required');
    }

    if (!req.content) {
      throw new BadRequestException('Message content is required');
    }

    // Check if space exists
    const space = await this.spaceRepository.findOne({ where: { id: spaceId } });
    if (!space) {
      throw new NotFoundException('Space not found');
    }

    // Check if user is a member of the space
    const isMember = await this.memberRepository.findOne({
      where: { spaceId, memberId: userId },
      relations: ['user'],
    });

    if (!isMember) {
      throw new ForbiddenException('User is not a member of this space');
    }

    // Get user info
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Create message
    const message = new ChatMessage();
    message.id = randomUUID();
    message.spaceId = spaceId;
    message.userId = userId;
    message.username = user.username;
    message.content = req.content;
    message.timestamp = Date.now();

    await this.chatRepository.save(message);

    // Auto-mark as read for sender
    await this.userConversationStateService.markAsRead(userId, spaceId, ConversationType.SPACE);

    return { message };
  }

  async deleteMessage(userId: string, msgId: string): Promise<DeleteMsgRes> {
    if (!msgId) {
      throw new BadRequestException('Message ID is required');
    }

    const message = await this.chatRepository.findById(msgId);
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.userId !== userId) {
      throw new ForbiddenException('You can only delete your own messages');
    }

    await this.chatRepository.delete(msgId);

    return { statusMessage: 'Message deleted successfully' };
  }

  async getSpaceChat(spaceId: string, userId: string, limit: number = 50): Promise<ChatMessage[]> {
    if (!spaceId) {
      throw new BadRequestException('Space ID is required');
    }

    // Check if user is a member of the space
    const isMember = await this.memberRepository.findOne({
      where: { spaceId, memberId: userId },
    });

    if (!isMember) {
      throw new ForbiddenException('User is not a member of this space');
    }

    return this.chatRepository.findBySpaceId(spaceId, limit);
  }

  /**
   * Get unread count for a space conversation.
   */
  async getSpaceUnreadCount(userId: string, spaceId: string): Promise<number> {
    return this.userConversationStateService.getSpaceUnreadCount(userId, spaceId);
  }

  /**
   * Mark all messages in a space as read for a user.
   */
  async markAsRead(userId: string, spaceId: string, lastReadId?: string): Promise<void> {
    // Verify user is member of space
    const isMember = await this.memberRepository.findOne({
      where: { spaceId, memberId: userId },
    });
    if (!isMember) {
      throw new ForbiddenException('User is not a member of this space');
    }

    let lastReadAt: Date | undefined;
    if (lastReadId) {
      const msg = await this.chatRepository.findById(lastReadId);
      if (msg) {
        lastReadAt = new Date(Number(msg.timestamp));
      }
    }

    await this.userConversationStateService.markAsRead(
      userId,
      spaceId,
      ConversationType.SPACE,
      lastReadAt,
    );
  }

  // TODO: Create DTO for message
  /**
   * Create a message from WebSocket event
   * This is used by the socket gateway to save messages
   */
  async createMessageFromSocket(message: any): Promise<CreateMsgRes> {
    if (!message || !message.spaceId || !message.username || !message.content) {
      throw new BadRequestException('Invalid message data');
    }

    const user = await this.userRepository.findOne({ where: { username: message.username } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user is a member of the space
    const isMember = await this.memberRepository.findOne({
      where: { spaceId: message.spaceId, memberId: user.id },
    });

    if (!isMember) {
      throw new ForbiddenException('User is not a member of this space');
    }

    // Create message entity
    const chatMessage = new ChatMessage();
    chatMessage.id = message.id || randomUUID();
    chatMessage.spaceId = message.spaceId;
    chatMessage.userId = user.id;
    chatMessage.username = user.username;
    chatMessage.content = message.content;
    chatMessage.timestamp = message.timestamp || Date.now();

    const savedMessage = await this.chatRepository.save(chatMessage);

    // Auto-mark as read for sender
    await this.userConversationStateService.markAsRead(
      user.id,
      chatMessage.spaceId,
      ConversationType.SPACE,
    );

    return { message: savedMessage };
  }

  /**
   * Update the last read message for a user in a space
   * @deprecated Use markAsRead instead
   */
  async updateLastReadMessage(userId: string, spaceId: string, _lastReadId: string): Promise<void> {
    await this.markAsRead(userId, spaceId);
  }

  async getSpaceMembers(spaceId: string): Promise<string[]> {
    const members = await this.memberRepository.find({
      where: { spaceId },
      select: ['memberId'],
    });
    return members.map((m) => m.memberId);
  }

  /**
   * Get all conversations (spaces and private) for a user with unread counts.
   */
  async getUnifiedConversations(userId: string) {
    const members = await this.memberRepository.find({
      where: { memberId: userId },
      relations: ['space'],
    });

    const spaceIds = members.map((m) => m.spaceId);
    let allSpacesMember = [...members];

    // Ensure default space is included if user is not a member
    if (!spaceIds.includes('1')) {
      const defaultSpace = await this.spaceRepository.findOne({ where: { id: '1' } });
      if (defaultSpace) {
        // Auto-join user to default space
        try {
          const member = new Member();
          member.spaceId = '1';
          member.memberId = userId;
          member.isAdmin = false;
          const savedMember = await this.memberRepository.save(member);
          allSpacesMember.push({ ...savedMember, space: defaultSpace } as Member);
        } catch (e) {
          // might fail if already exists but not fetched (race condition)
        }
      }
    }

    const spacesWithUnread = await Promise.all(
      allSpacesMember.map(async (m) => {
        const state = await this.userConversationStateService.getOrCreate(
          userId,
          m.spaceId,
          ConversationType.SPACE,
        );
        const unreadCount = await this.userConversationStateService.getSpaceUnreadCount(
          userId,
          m.spaceId,
        );
        const lastMessage = await this.chatRepository.find({
          where: { spaceId: m.spaceId },
          order: { timestamp: 'DESC' },
          take: 1,
        });

        return {
          ...m.space,
          unreadCount,
          lastMessage: lastMessage[0] || null,
          isMuted: state.isMuted,
          type: 'space',
        };
      }),
    );

    return { spaces: spacesWithUnread };
  }

  /**
   * Toggle mute status for a space.
   */
  async toggleMute(userId: string, spaceId: string, isMuted?: boolean): Promise<void> {
    const member = await this.memberRepository.findOne({
      where: { spaceId, memberId: userId },
    });

    if (!member) {
      throw new ForbiddenException('Not a member of this space');
    }

    await this.userConversationStateService.toggleMute(
      userId,
      spaceId,
      ConversationType.SPACE,
      isMuted,
    );
  }

  async updateLastSoundPlayed(userId: string, spaceId: string): Promise<void> {
    await this.userConversationStateService.updateLastSoundPlayed(
      userId,
      spaceId,
      ConversationType.SPACE,
    );
  }
}
