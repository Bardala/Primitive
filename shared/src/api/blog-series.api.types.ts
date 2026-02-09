import { Blog, BlogSeries } from '../types';

export interface CreateSeriesReq {
  name: string;
  description?: string;
}

export interface UpdateSeriesReq {
  name?: string;
  description?: string;
}

export interface AddBlogToSeriesReq {
  blogId: string;
  position: number;
}

export interface GetSeriesRes {
  series: BlogSeries;
  blogs: (Pick<Blog, 'id' | 'title' | 'author'> & { position: number })[];
}

export interface ListSeriesRes {
  series: BlogSeries[];
}
