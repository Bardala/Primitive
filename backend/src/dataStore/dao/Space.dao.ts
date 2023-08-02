import { Blog, ChatMessage, Space, SpaceMember } from '@nest/shared';

export interface SpaceDao {
  createSpace(space: Space): Promise<void>;
  updateSpace(space: Space): Promise<Space | undefined>;
  getSpace(spaceId: string): Promise<Space | undefined>;
  deleteSpace(spaceId: string): Promise<void>;

  // getDefaultSpace(): Promise<Space | undefined>; // use getSpace
  getBlogs(spaceId: string): Promise<Blog[]>;
  getSpaceChat(spaceId: string): Promise<ChatMessage[]>;

  addMember(member: SpaceMember): Promise<void>;
  spaceMembers(spaceId: string): Promise<SpaceMember[]>;
  isMember(spaceId: string, memberId: string): Promise<boolean>;
  isSpaceAdmin(spaceId: string, memberId: string): Promise<boolean>;
}
