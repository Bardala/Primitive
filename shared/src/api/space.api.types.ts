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
  blogs: Blog[];
}

export interface DeleteSpaceReq {}
export interface DeleteSpaceRes {}

export interface DefaultSpaceReq {}
export interface DefaultSpaceRes {
  space: Space;
  blogs: Blog[];
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
