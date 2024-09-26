import { Blog, ChatMessage, Space, SpaceMember } from '../types';
export type CreateSpaceReq = Pick<Space, 'name' | 'status' | 'description'>;
export interface CreateSpaceRes {
    space: Space;
}
export type UpdateSpaceReq = Pick<Space, 'description' | 'name' | 'status'>;
export interface UpdateSpaceRes {
    space: Space;
}
export interface SpaceReq {
}
export interface SpaceRes {
    space: Space;
}
export interface DeleteSpaceReq {
}
export interface DeleteSpaceRes {
}
export interface DefaultSpaceReq {
}
export interface DefaultSpaceRes {
    space: Space;
}
export interface SpaceBlogsReq {
}
export interface SpaceBlogsRes {
    blogs: Blog[];
    page: number;
}
export interface SpaceShortsReq {
}
export interface SpaceShortsRes {
}
export interface JoinSpaceReq {
}
export interface JoinSpaceRes {
    member: SpaceMember;
}
export interface AddMemberReq {
    member: string;
    isAdmin: boolean;
}
export interface AddMemberRes {
    member: SpaceMember;
}
export interface MembersReq {
}
export interface MembersRes {
    members: SpaceMember[];
}
export interface ChatReq {
}
export interface ChatRes {
    messages: ChatMessage[];
}
export interface UnReadMsgsNumReq {
}
export interface UnReadMsgsNumRes {
    numOfUnReadMsgs: number;
}
export interface DeleteMemReq {
}
export interface DeleteMemRes {
}
export interface LeaveSpaceReq {
}
export interface LeaveSpaceRes {
}
