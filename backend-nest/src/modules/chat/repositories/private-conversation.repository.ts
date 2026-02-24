import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PrivateConversation } from '../entities/private-conversation.entity';

@Injectable()
export class PrivateConversationRepository extends Repository<PrivateConversation> {
  constructor(dataSource: DataSource) {
    super(PrivateConversation, dataSource.createEntityManager());
  }

  /**
   * Get the total number of messages in the private conversation between two users.
   * @param userId The ID of the first user.
   * @param secUserId The ID of the second user.
   * @returns The total message count in their conversation.
   */
  async getConversationMsgsCount(userId: string, secUserId: string): Promise<number> {
    const result = await this.createQueryBuilder('c')
      .innerJoin('c.messages', 'm')
      .where(
        '(c.user1Id = :userId AND c.user2Id = :secUserId) OR (c.user1Id = :secUserId AND c.user2Id = :userId)',
        { userId, secUserId },
      )
      .select('COUNT(m.id)', 'count')
      .getRawOne();

    return result ? parseInt(result.count, 10) : 0;
  }
}
