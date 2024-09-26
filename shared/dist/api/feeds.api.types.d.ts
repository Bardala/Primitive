import { Blog } from '../types';
export interface FeedsReq {
}
export interface FeedsRes {
    feeds: Blog[];
    page: number;
}
