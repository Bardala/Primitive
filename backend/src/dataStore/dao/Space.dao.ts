import { Blog, ChatMessage, LastReadMsg, Space, SpaceMember, User } from '@nest/shared';

export interface SpaceDao {
  createSpace(space: Space): Promise<void>;
  updateSpace(space: Space): Promise<Space | undefined>;
  getSpace(spaceId: string): Promise<Space | undefined>;
  deleteSpace(spaceId: string): Promise<void>;

  getBlogs(spaceId: string, pageSize: number, offset: number): Promise<Blog[]>;
  getSpaceChat(spaceId: string, limit: number): Promise<ChatMessage[]>;
  numOfUnReadMsgs(params: { userId: string; spaceId: string }): Promise<number>;
  updateLastReadMsg(lastRead: LastReadMsg): Promise<void>;

  addMember(member: SpaceMember): Promise<void>;
  spaceMembers(spaceId: string): Promise<SpaceMember[]>;
  isMember(spaceId: string, memberId: string): Promise<User | undefined>;
  isSpaceAdmin(spaceId: string, memberId: string): Promise<boolean>;
  deleteMember(spaceId: string, memberId: string): Promise<void>;
}
