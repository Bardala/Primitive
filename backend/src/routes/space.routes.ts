import { ENDPOINT } from '@nest/shared';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import { SpaceController } from '../controllers/space.controller';
import { optionalAuth, requireAuth } from '../middleware/authMiddleware';
import { checkEmptyInput } from '../middleware/checkReqBody';

export const createSpaceRoutes = (spaceController: SpaceController) => {
  const router = Router();

  router.post(
    ENDPOINT.CREATE_SPACE,
    requireAuth,
    checkEmptyInput,
    asyncHandler(spaceController.createSpace)
  );
  router.put(
    ENDPOINT.UPDATE_SPACE,
    requireAuth,
    checkEmptyInput,
    asyncHandler(spaceController.updateSpace)
  );
  router.get(ENDPOINT.GET_SPACE, optionalAuth, asyncHandler(spaceController.getSpace));
  router.delete(ENDPOINT.DELETE_SPACE, requireAuth, asyncHandler(spaceController.deleteSpace));

  router.get(ENDPOINT.GET_DEFAULT_SPACE, asyncHandler(spaceController.getDefaultSpace));
  router.post(
    ENDPOINT.JOIN_SPACE,
    requireAuth,
    checkEmptyInput,
    asyncHandler(spaceController.joinSpace)
  );
  router.post(
    ENDPOINT.ADD_MEMBER,
    requireAuth,
    checkEmptyInput,
    asyncHandler(spaceController.addMember)
  );
  router.get(
    ENDPOINT.GET_SPACE_MEMBERS,
    requireAuth,
    asyncHandler(spaceController.getSpaceMembers)
  );
  router.get(ENDPOINT.Get_SPACE_CHAT, requireAuth, asyncHandler(spaceController.getChat));
  router.delete(ENDPOINT.DELETE_MEMBER, requireAuth, asyncHandler(spaceController.deleteMember));
  router.delete(ENDPOINT.LEAVE_SPACE, requireAuth, asyncHandler(spaceController.leaveSpace));
  router.get(ENDPOINT.GET_SPACE_BLOGS, optionalAuth, asyncHandler(spaceController.blogs));
  router.get(
    ENDPOINT.GET_UNREAD_MSGS_NUM,
    requireAuth,
    asyncHandler(spaceController.getNumOfUnReadMsgs)
  );

  // Feeds
  router.get(ENDPOINT.GET_FEEDS_PAGE, optionalAuth, asyncHandler(spaceController.feeds));
  router.get(ENDPOINT.Get_SMART_FEEDS, optionalAuth, asyncHandler(spaceController.smarterFeeds));

  return router;
};
