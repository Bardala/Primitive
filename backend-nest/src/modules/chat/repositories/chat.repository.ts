import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ChatMessage } from '../entities/chat-message.entity';

@Injectable()
export class ChatRepository extends Repository<ChatMessage> {
  constructor(dataSource: DataSource) {
    super(ChatMessage, dataSource.createEntityManager());
  }

  async findById(id: string): Promise<ChatMessage | null> {
    return this.findOne({
      where: { id },
    });
  }

  async findBySpaceId(spaceId: string, limit: number = 50): Promise<ChatMessage[]> {
    return this.find({
      where: { spaceId },
      take: limit,
      order: { timestamp: 'DESC' },
    });
  }
}
