import { Blog, ChatMessage, Space, SpaceMember } from '../types';

export type CreateSpaceReq = Pick<Space, 'name' | 'status' | 'description'>;
export interface CreateSpaceRes {
  space: Space;
  // members: string;
  // blogs: Blog[];
}

export type UpdateSpaceReq = Pick<Space, 'description' | 'name' | 'status'>;
export interface UpdateSpaceRes {
  space: Space;
}

// todo: let SpaceRes returns just space, and add a new api call for getting space blogs
export interface SpaceReq {}
export interface SpaceRes {
  space: Space;
  // blogs: Blog[];
  // shorts: Short[];
}

export interface DeleteSpaceReq {}
export interface DeleteSpaceRes {}

export interface DefaultSpaceReq {}
export interface DefaultSpaceRes {
  space: Space;
}

export interface SpaceBlogsReq {}
export interface SpaceBlogsRes {
  blogs: Blog[];
  page: number;
}

export interface SpaceShortsReq {}
export interface SpaceShortsRes {
  // shorts: Short[];
}

export interface JoinSpaceReq {} // locals.userId // params.spaceId
export interface JoinSpaceRes {
  member: SpaceMember;
}

export interface AddMemberReq {
  member: string; // userId || username
  isAdmin: boolean;
}
export interface AddMemberRes {
  member: SpaceMember;
}

export interface MembersReq {}
export interface MembersRes {
  members: SpaceMember[];
}

export interface ChatReq {}
export interface ChatRes {
  messages: ChatMessage[];
}

export interface UnReadMsgsNumReq {}
export interface UnReadMsgsNumRes {
  numOfUnReadMsgs: number;
}

export interface DeleteMemReq {}
export interface DeleteMemRes {}

export interface LeaveSpaceReq {}
export interface LeaveSpaceRes {}
