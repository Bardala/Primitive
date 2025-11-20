import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserActivity } from '../entities/user-activity.entity';

@Injectable()
export class UserActivityService {
  constructor(
    @InjectRepository(UserActivity)
    private userActivityRepository: Repository<UserActivity>,
  ) {}

  async updateLastActive(userId: string): Promise<void> {
    await this.userActivityRepository.upsert({ userId, lastActive: new Date() }, ['userId']);
  }

  async getLastActive(userId: string): Promise<Date | null> {
    const activity = await this.userActivityRepository.findOne({
      where: { userId },
    });
    return activity?.lastActive || null;
  }
}
