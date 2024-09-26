import { CommentWithUser, LikedUser, Short } from '../types';
export type CreateShortReq = Pick<Short, 'title' | 'content'>;
export interface CreateShortRes {
    short: Short;
}
export type UpdateShortReq = Pick<Short, 'id' | 'title' | 'content'>;
export interface UpdateShortRes {
    short: Short;
}
export interface DeleteShortReq {
}
export interface DeleteShortRes {
}
export interface GetShortReq {
}
export interface GetShortRes {
    short: Short;
}
export interface ShortLikesReq {
}
export interface ShortLikesRes {
    likes: number;
}
export interface ShortLikesListReq {
}
export interface ShortLikesListRes {
    users: LikedUser[];
}
export interface ShortCommentsReq {
}
export interface ShortCommentsRes {
    comments: CommentWithUser[];
}
