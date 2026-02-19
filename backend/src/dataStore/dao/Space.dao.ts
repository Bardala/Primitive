import { Blog, ChatMessage, Space } from '@nest/shared';

export interface SpaceDao {
  createSpace(space: Space): Promise<void>;
  updateSpace(space: Space): Promise<Space | undefined>;
  getSpace(spaceId: string): Promise<Space | undefined>;
  deleteSpace(spaceId: string): Promise<void>;
  searchSpaces(query: string): Promise<Space[]>;
  getSpacesByOwner(ownerId: string): Promise<Space[]>;

  // Space content
  getBlogs(spaceId: string, pageSize: number, offset: number): Promise<Blog[]>;
  getSpaceChat(spaceId: string, limit: number): Promise<ChatMessage[]>;
  getSpaceStats(spaceId: string): Promise<{ memberCount: number; blogCount: number }>;

  numOfUnReadMsgs(params: { userId: string; spaceId: string }): Promise<number>;

  // moved to LastReadDao as updateLastRead
  // updateLastReadMsg(lastRead: LastReadMsg): Promise<void>;

  // moved to memberDao
  // isSpaceAdmin(spaceId: string, memberId: string): Promise<boolean>;
  // isMember(spaceId: string, memberId: string): Promise<User | undefined>;
  // spaceMembers(spaceId: string): Promise<SpaceMember[]>;
  // addMember(member: SpaceMember): Promise<void>;
  // deleteMember(spaceId: string, memberId: string): Promise<void>;
}
