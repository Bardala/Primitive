import { deleteFn, getFn, postFn } from '@/core/services';

import {
  BlogLikesListRes,
  BlogLikesRes,
  CreateLikeReq,
  CreateLikeRes,
  ENDPOINT,
  RemoveLikeRes,
} from '@nest/shared';

export const LikeApi = {
  getBlogLikes: (blogId: string) => getFn<BlogLikesRes>(ENDPOINT.GET_BLOG_LIKES, [blogId]),

  getBlogLikesList: (blogId: string) =>
    getFn<BlogLikesListRes>(ENDPOINT.GET_BLOG_LIKES_LIST, [blogId]),

  createLike: (blogId: string) =>
    postFn<CreateLikeReq, CreateLikeRes>(ENDPOINT.LIKE_BLOG, undefined, [blogId]),

  deleteLike: (blogId: string) => deleteFn<RemoveLikeRes>(ENDPOINT.UNLIKE_BLOG, [blogId]),
};
