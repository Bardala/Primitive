import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from 'src/modules/notification/entities/notification.entity';
import { BaseValidator } from '../base.validator';

/**
 * Notification entity validator
 * Handles validation for Notification entities
 */
@Injectable()
export class NotificationValidator extends BaseValidator<Notification> {
  constructor(
    @InjectRepository(Notification)
    notificationRepository: Repository<Notification>,
  ) {
    super(notificationRepository);
  }

  /**
   * Validates that a notification exists by notification ID
   * @param notificationId - The notification ID to validate
   * @returns The found notification
   */
  async validateNotificationExists(notificationId: string): Promise<Notification> {
    return this.validateExists(notificationId, 'Notification not found');
  }

  protected getEntityName(): string {
    return 'Notification';
  }
}
