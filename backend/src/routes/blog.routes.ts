import { ENDPOINT } from '@nest/shared';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import { BlogController } from '../controllers/blog.controller';
import { requireAuth } from '../middleware/authMiddleware';
import { checkEmptyInput } from '../middleware/checkReqBody';

export const createBlogRoutes = (blogController: BlogController) => {
  const router = Router();

  router.post(
    ENDPOINT.CREATE_BLOG,
    requireAuth,
    checkEmptyInput,
    asyncHandler(blogController.createBlog)
  );
  router.put(
    ENDPOINT.UPDATE_BLOG,
    requireAuth,
    checkEmptyInput,
    asyncHandler(blogController.updateBlog)
  );
  router.get(ENDPOINT.GET_BLOG, requireAuth, asyncHandler(blogController.getBlog));
  router.delete(ENDPOINT.DELETE_BLOG, requireAuth, asyncHandler(blogController.deleteBlog));

  router.get(ENDPOINT.GET_BLOG_COMMENTS, requireAuth, asyncHandler(blogController.getBlogComments));
  router.get(ENDPOINT.GET_BLOG_LIKES, requireAuth, asyncHandler(blogController.getBlogLikes));
  router.get(
    ENDPOINT.GET_BLOG_LIKES_LIST,
    requireAuth,
    asyncHandler(blogController.getBlogLikesList)
  );
  router.post(
    ENDPOINT.LIKE_BLOG,
    requireAuth,
    checkEmptyInput,
    asyncHandler(blogController.likeBlog)
  );
  router.delete(ENDPOINT.UNLIKE_BLOG, requireAuth, asyncHandler(blogController.unLikeBlog));
  router.get(ENDPOINT.NUM_OF_COMMENTS, requireAuth, asyncHandler(blogController.getNumOfComments));

  return router;
};
