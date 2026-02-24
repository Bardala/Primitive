import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { NotificationType } from '@nest/shared';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { randomUUID } from 'node:crypto';

export interface MessageEvent {
  data: string | object;
  id?: string;
  type?: string;
  retry?: number;
}

@Injectable()
export class NotificationService {
  private notificationSubject = new Subject<{ userId: string; notification: Notification }>();

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  /**
   * Create and send a notification to a specific user.
   * Saves to DB and emits to SSE stream.
   */
  async sendNotification(
    userId: string,
    type: NotificationType,
    refId?: string,
    payload?: any,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      id: randomUUID(),
      userId,
      type,
      refId,
      payload,
      isRead: false,
    });

    const savedNotification = await this.notificationRepository.save(notification);

    this.notificationSubject.next({ userId, notification: savedNotification });

    return savedNotification;
  }

  /**
   * Subscribe to real-time notifications for a user (SSE).
   */
  subscribe(userId: string): Observable<MessageEvent> {
    return this.notificationSubject.asObservable().pipe(
      filter((event) => event.userId === userId),
      map(
        (event) =>
          ({
            data: event.notification,
          }) as MessageEvent,
      ),
    );
  }

  /**
   * Get notification history for a user.
   */
  async getNotifications(userId: string): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  /**
   * Mark a single notification as read.
   */
  async markAsRead(id: string): Promise<void> {
    await this.notificationRepository.update(id, { isRead: true });
  }

  /**
   * Mark all notifications as read for a user.
   */
  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update({ userId, isRead: false }, { isRead: true });
  }
}
