import { LikedUser } from '../types';

export interface LikePostReq {}
export interface LikePostRes {}

export interface UnLikePostReq {}
export interface UnLikePostRes {}

export interface GetPostLikesReq {}
export interface GetPostLikesRes {
  users: LikedUser[];
}
