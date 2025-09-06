import { ENDPOINT } from '@nest/shared';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import { CommentController } from '../controllers/comment.controller';
import { requireAuth } from '../middleware/authMiddleware';
import { checkEmptyInput } from '../middleware/checkReqBody';

export const createCommentRoutes = (commentController: CommentController) => {
  const router = Router();

  router.post(
    ENDPOINT.CREATE_COMMENT,
    requireAuth,
    checkEmptyInput,
    asyncHandler(commentController.createComment)
  );
  router.put(
    ENDPOINT.UPDATE_COMMENT,
    requireAuth,
    checkEmptyInput,
    asyncHandler(commentController.updateComment)
  );
  router.delete(
    ENDPOINT.DELETE_COMMENT,
    requireAuth,
    asyncHandler(commentController.deleteComment)
  );

  return router;
};
