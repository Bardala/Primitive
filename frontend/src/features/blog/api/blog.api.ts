import { deleteFn, getFn, postFn, putFn } from '@/core/services';

import {
  BlogRes,
  CreateBlogReq,
  CreateBlogRes,
  DeleteBlogRes,
  ENDPOINT,
  updateBlogReq,
  updateBlogRes,
} from '@nest/shared';

export const BlogApi = {
  getBlog: (blogId: string) => getFn<BlogRes>(ENDPOINT.GET_BLOG, [blogId]),

  createBlog: (title: string, content: string, spaceId: string, seriesId?: string, tagNames?: string[]) => () =>
    postFn<CreateBlogReq, CreateBlogRes>(ENDPOINT.CREATE_BLOG, {
      title,
      content,
      spaceId,
      seriesId,
      tagNames,
    }),

  createShort: (title: string, content: string, spaceId: string) => () =>
    postFn<CreateBlogReq, CreateBlogRes>(ENDPOINT.CREATE_BLOG, {
      title,
      content,
      spaceId,
    }),

  updateBlog: (blogId: string, data: updateBlogReq) => () =>
    putFn<updateBlogReq, updateBlogRes>(ENDPOINT.UPDATE_BLOG, data, [blogId]),

  deleteBlog: (blogId: string) => deleteFn<DeleteBlogRes>(ENDPOINT.DELETE_BLOG, [blogId]),
};
