import { Notification } from '@nest/shared';

export interface NotificationDao {
  createNotification(notification: Notification): Promise<void>;
  getUserNotifications(userId: string, limit?: number, offset?: number): Promise<Notification[]>;
  getUnreadNotifications(userId: string): Promise<Notification[]>;
  markAsRead(notificationId: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
  deleteNotification(notificationId: string): Promise<void>;
  deleteUserNotifications(userId: string): Promise<void>;
  getNotificationCount(userId: string): Promise<{ total: number; unread: number }>;
}
