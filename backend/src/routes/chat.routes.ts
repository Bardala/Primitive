import { ENDPOINT } from '@nest/shared';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import { ChatController } from '../controllers/chat.controller';
import { requireAuth } from '../middleware/authMiddleware';
import { checkEmptyInput } from '../middleware/checkReqBody';

export const createChatRoutes = (chatController: ChatController) => {
  const router = Router();

  router.post(
    ENDPOINT.CREATE_MESSAGE,
    requireAuth,
    checkEmptyInput,
    asyncHandler(chatController.createMessage)
  );
  router.delete(ENDPOINT.DELETE_MESSAGE, requireAuth, asyncHandler(chatController.deleteMessage));

  return router;
};
