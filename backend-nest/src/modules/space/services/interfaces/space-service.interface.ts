import {
  CreateSpaceReq,
  CreateSpaceRes,
  SpaceRes,
  UpdateSpaceReq,
  UpdateSpaceRes,
  DeleteSpaceRes,
  DefaultSpaceRes,
  JoinSpaceRes,
  LeaveSpaceRes,
  AddMemberReq,
  AddMemberRes,
  MembersRes,
  DeleteMemRes,
  ChatRes,
  UnReadMsgsNumRes,
  SpaceBlogsRes,
} from '../../dto';

export interface ISpaceService {
  createSpace(userId: string, req: CreateSpaceReq): Promise<CreateSpaceRes>;
  getSpace(userId: string | undefined, spaceId: string): Promise<SpaceRes>;
  updateSpace(userId: string, spaceId: string, req: UpdateSpaceReq): Promise<UpdateSpaceRes>;
  deleteSpace(userId: string, spaceId: string): Promise<DeleteSpaceRes>;
  getDefaultSpace(): Promise<DefaultSpaceRes>;
  joinSpace(userId: string, spaceId: string): Promise<JoinSpaceRes>;
  leaveSpace(userId: string, spaceId: string): Promise<LeaveSpaceRes>;
  addMember(userId: string, spaceId: string, req: AddMemberReq): Promise<AddMemberRes>;
  getMembers(userId: string, spaceId: string): Promise<MembersRes>;
  deleteMember(userId: string, spaceId: string, memberId: string): Promise<DeleteMemRes>;
  getChat(userId: string, spaceId: string): Promise<ChatRes>;
  getUnreadCount(userId: string, spaceId: string): Promise<UnReadMsgsNumRes>;
  getBlogs(userId: string | undefined, spaceId: string, page: number): Promise<SpaceBlogsRes>;
  getDefaultSpaceBlogs(_userId: string | undefined, page: number): Promise<SpaceBlogsRes>;
  checkMembership(spaceId: string, userId: string): Promise<boolean>;
}
