import { Blog, Space, User, UserCard } from '../../../../shared/src/types';

export interface UserDao {
  createUser(user: User): Promise<void>;
  updateUser(user: User): Promise<void>;
  deleteUser(userId: string): Promise<void>;
  getUserById(userId: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;

  getUsers(): Promise<User[]>;
  getUsersList(): Promise<string[]>;
  createFollow(followerId: string, followingId: string): Promise<void>;
  deleteFollow(followerId: string, followingId: string): Promise<void>;
  getFollowers(followingId: string): Promise<string[]>;
  getUserCard(userId: string, cardOwnerId: string): Promise<UserCard | undefined>;
  getUserBlogs(userId: string): Promise<Blog[]>;
  getUserSpaces(userId: string): Promise<Space[]>;
}
