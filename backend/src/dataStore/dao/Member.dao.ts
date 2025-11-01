import { SpaceMember, User } from '@nest/shared';

export interface MemberDao {
  addMember(member: SpaceMember): Promise<void>;
  removeMember(spaceId: string, memberId: string): Promise<void>;
  updateMemberAdminStatus(spaceId: string, memberId: string, isAdmin: boolean): Promise<void>;
  getSpaceMembers(spaceId: string): Promise<SpaceMember[]>;
  isMember(spaceId: string, memberId: string): Promise<User | undefined>;
  isSpaceAdmin(spaceId: string, memberId: string): Promise<boolean>;
  getMemberSpacesWithInfo(userId: string): Promise<Array<{ spaceId: string; isAdmin: boolean }>>;
}
