import { Blog } from '../types';

// todo: add pagination, add post
export interface FeedsReq {
  page: number;
}

export interface FeedsRes {
  feeds: Blog[];
  page: number;
}
