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
}
