import { Blog } from '../types';

// todo: add pagination, add post
export interface FeedsReq {}
export interface FeedsRes {
  feeds: Blog[];
  page: number;
}
