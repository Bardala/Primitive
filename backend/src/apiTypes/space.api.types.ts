import { Blog, Space } from "../dataStore/types";

// getAllSpaces, for Dev purposes
export interface AllSpacesReq_Dev {}
export interface AllSpacesRes_Dev {
  spaces: Space[];
}

// createSpace
export type CreateSpaceReq = Pick<Space, "name" | "status" | "description">;
export interface CreateSpaceRes {
  space: Space;
  admins: string;
  members: string;
  blogs: Blog[];
}

// getDefaultSpace
export interface DefaultSpaceReq {}
export interface DefaultSpaceRes {
  space: Space;
  blogs: Blog[];
}

// getSpace
export interface SpaceReq {}
export interface SpaceRes {
  space: Space;
  admins: string;
  members: string;
  blogs: Blog[];
}

// updateSpace
export type UpdateSpaceReq = Pick<Space, "description" | "name" | "status">;
export interface UpdateSpaceRes {
  space: Space;
}

// joinSpace
export interface JoinSpaceReq {}
export interface JoinSpaceRes {} // at master I return Space, here I will just send OK

// addUser
export interface AddMemberReq {
  spaceId: string;
  memberId: string;
}
export interface AddMemberRes {}

// deleteSpace
export interface DeleteSpaceReq {}
export interface DeleteSpaceRes {}

// getUserSpaces
export interface SpacesReq {}
export interface SpacesRes {
  spaces: Pick<Space, "id" | "name" | "status">[];
}
