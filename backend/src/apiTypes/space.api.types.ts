import {
  Blog,
  Handler,
  HandlerWithParams,
  Space,
  SpaceMember,
} from "../dataStore/types";

export type CreateSpaceReq = Pick<Space, "name" | "status" | "description">;
export interface CreateSpaceRes {
  // space: Space;
  // members: string;
  // blogs: Blog[];
}

export type UpdateSpaceReq = Pick<Space, "description" | "name" | "status">;
export interface UpdateSpaceRes {
  space: Space;
}

export interface SpaceReq {}
export interface SpaceRes {
  space: Space;
  admins: string;
  members: string;
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
export interface JoinSpaceRes {}

export interface AddMemberReq {
  memberId: string;
}
export interface AddMemberRes {}

export interface MembersReq {}
export interface MembersRes {
  members: SpaceMember[];
}

// *Controller
export interface spaceController {
  createSpace: Handler<CreateSpaceReq, CreateSpaceRes>;
  updateSpace: HandlerWithParams<
    { spaceId: string },
    UpdateSpaceReq,
    UpdateSpaceRes
  >;
  getSpace: HandlerWithParams<{ spaceId: string }, SpaceReq, SpaceRes>;
  deleteSpace: HandlerWithParams<
    { spaceId: string },
    DeleteSpaceReq,
    DefaultSpaceRes
  >;

  getDefaultSpace: Handler<DefaultSpaceReq, DefaultSpaceRes>;
  joinSpace: HandlerWithParams<{ spaceId: string }, JoinSpaceReq, JoinSpaceRes>;
  addMember: HandlerWithParams<{ spaceId: string }, AddMemberReq, AddMemberRes>;
  getSpaceMembers: HandlerWithParams<
    { spaceId: string },
    MembersReq,
    MembersRes
  >;
}
