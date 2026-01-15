import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LastRead } from '../entities';
import { ILastRead } from './interfaces';

@Injectable()
export class LastReadService implements ILastRead {
  constructor(
    @InjectRepository(LastRead)
    private lastReadRepo: Repository<LastRead>,
  ) {}

  // TODO: handle duplicate entry
  /**
   *  Creates or updates the last read message information for a specific user in a specific space.
   * @param lastRead
   */
  async updateLastRead(lastRead: LastRead): Promise<void> {
    await this.lastReadRepo.save(lastRead);
  }
  /**
   *  Retrieves the last read message information for a specific user in a specific space.
   * @param userId
   * @param spaceId
   * @returns
   */
  async getLastRead(userId: string, spaceId: string): Promise<LastRead | null> {
    return await this.lastReadRepo.findOne({ where: { userId, spaceId } });
  }
  /**
   *  Deletes all last read records for a specific user.
   *  @param userId - The ID of the user whose last read records are to be deleted.
   **/
  async deleteUserLastRead(userId: string): Promise<void> {
    await this.lastReadRepo.delete({ userId });
  }
  /**
   *  Deletes all last read records for a specific space.
   *  @param spaceId - The ID of the space whose last read records are to be deleted.
   **/
  async deleteSpaceLastRead(spaceId: string): Promise<void> {
    await this.lastReadRepo.delete({ spaceId });
  }
}
