import { Blog, Space, UnReadMsgs, User, UserCard, UsersList } from '@nest/shared';

export interface UserDao {
  createUser(user: User): Promise<void>;
  updateUser(user: User): Promise<void>;
  deleteUser(userId: string): Promise<void>;
  getUserById(userId: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;

  getUsers(): Promise<User[]>;
  getUsersList(): Promise<UsersList[]>;
  createFollow(followerId: string, followingId: string): Promise<void>;
  deleteFollow(followerId: string, followingId: string): Promise<void>;
  getFollowers(followingId: string): Promise<Pick<User, 'id' | 'username'>[]>;
  getUserCard(userId: string, cardOwnerId: string): Promise<UserCard | undefined>;
  getUserBlogs(userId: string, pageSize: number, offset: number): Promise<Blog[]>;
  getUserSpaces(userId: string): Promise<Space[]>;
  isFollow(followingId: string, userId: string): Promise<boolean>;

  numOfAllUnReadMsgs(userId: string): Promise<UnReadMsgs[]>;
}
