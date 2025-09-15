import { ENDPOINT } from '@nest/shared';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import { UserController } from '../controllers/user.controller';
import { requireAuth } from '../middleware/authMiddleware';

export const createUserRoutes = (userController: UserController) => {
  const router = Router();

  router.get(ENDPOINT.GET_USER_CARD, requireAuth, asyncHandler(userController.getUserCard));
  router.post(ENDPOINT.FOLLOW_USER, requireAuth, asyncHandler(userController.createFollow));
  router.delete(ENDPOINT.UNFOLLOW_USER, requireAuth, asyncHandler(userController.deleteFollow));
  router.get(ENDPOINT.GET_FOLLOWERS, requireAuth, asyncHandler(userController.getFollowers));
  router.get(ENDPOINT.GET_USERS_LIST, requireAuth, asyncHandler(userController.getUsersList));
  router.get(ENDPOINT.GET_USER_BLOGS, requireAuth, asyncHandler(userController.getUserBlogs));
  router.get(ENDPOINT.GET_USER_SPACES, requireAuth, asyncHandler(userController.getUserSpaces));
  router.get(
    ENDPOINT.GET_ALL_UNREAD_MSGS,
    requireAuth,
    asyncHandler(userController.getAllUnReadMsgs)
  );
  router.post(
    ENDPOINT.UPDATE_USER_PASSWORD,
    requireAuth,
    asyncHandler(userController.updateUserPassword)
  );
  router.get(
    ENDPOINT.GET_ALL_USER_BLOGS,
    requireAuth,
    asyncHandler(userController.getAllUserBlogs)
  );
  return router;
};
