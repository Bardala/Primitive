import { UserActivity } from '@nest/shared';

export interface UserActivityDao {
  updateUserActivity(userId: string): Promise<void>;
  getUserActivity(userId: string): Promise<UserActivity | undefined>;
  getUsersActivity(userIds: string[]): Promise<UserActivity[]>;
  deleteUserActivity(userId: string): Promise<void>;
  getOnlineUsers(): Promise<UserActivity[]>;
}
