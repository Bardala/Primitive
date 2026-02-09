import { Injectable } from '@nestjs/common';

@Injectable()
export class PresenceService {
  // Map of userId -> count of active socket connections
  private activeUsers = new Map<string, number>();

  /**
   * Add a connection for a user
   * @returns true if this is the user's first connection (transitioned to online)
   */
  addConnection(userId: string): boolean {
    const currentCount = this.activeUsers.get(userId) || 0;
    this.activeUsers.set(userId, currentCount + 1);
    return currentCount === 0;
  }

  /**
   * Remove a connection for a user
   * @returns true if this was the user's last connection (transitioned to offline)
   */
  removeConnection(userId: string): boolean {
    const currentCount = this.activeUsers.get(userId) || 0;
    if (currentCount <= 1) {
      this.activeUsers.delete(userId);
      return currentCount === 1;
    } else {
      this.activeUsers.set(userId, currentCount - 1);
      return false;
    }
  }

  /**
   * Check if a user is online
   */
  isOnline(userId: string): boolean {
    return this.activeUsers.has(userId);
  }

  /**
   * Get all online user IDs
   */
  getOnlineUserIds(): string[] {
    return Array.from(this.activeUsers.keys());
  }
}
