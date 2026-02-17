import { Blog } from '../types';

// todo: add pagination, add post
export interface FeedsReq {
  page: number;
}

export interface FeedsRes {
  // Includes space, tags, series info
  feeds: Blog[];
  page: number;
}
