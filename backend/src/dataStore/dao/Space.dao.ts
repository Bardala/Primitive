import { Blog, Space, SpaceMember } from "../../../../shared/src/types";

export interface SpaceDao {
  createSpace(space: Space): Promise<void>;
  updateSpace(space: Space): Promise<Space | undefined>;
  getSpace(spaceId: string): Promise<Space | undefined>;
  deleteSpace(spaceId: string): Promise<void>;

  // getDefaultSpace(): Promise<Space | undefined>; // use getSpace
  getBlogs(spaceId: string): Promise<Blog[]>;
  addMember(spaceId: string, memberId: string): Promise<void>;
  spaceMembers(spaceId: string): Promise<SpaceMember[]>;
  isMember(spaceId: string, memberId: string): Promise<boolean>;
}
