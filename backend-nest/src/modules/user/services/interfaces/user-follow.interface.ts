/**
 * IUserFollowService interface
 * Responsibility: Handle user follow/follower relationships
 */
export interface IUserFollowService {
  getFollowers(userId: string): Promise<{ id: string; username: string }[]>;
  getFollowing(userId: string): Promise<{ id: string; username: string }[]>;
  createFollow(followerId: string, followingId: string): Promise<void>;
  deleteFollow(followerId: string, followingId: string): Promise<void>;
  isFollowing(followerId: string, followingId: string): Promise<boolean>;
}
