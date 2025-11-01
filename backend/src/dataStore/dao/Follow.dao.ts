import { User } from '@nest/shared';

export interface FollowDao {
  createFollow(followerId: string, followingId: string): Promise<void>;
  deleteFollow(followerId: string, followingId: string): Promise<void>;
  getFollowers(followingId: string): Promise<Pick<User, 'id' | 'username'>[]>;
  getFollowing(followerId: string): Promise<Pick<User, 'id' | 'username'>[]>;
  isFollowing(followerId: string, followingId: string): Promise<boolean>;
  isFollow(followingId: string, userId: string): Promise<boolean>;
  getFollowerCount(userId: string): Promise<number>;
  getFollowingCount(userId: string): Promise<number>;
}
