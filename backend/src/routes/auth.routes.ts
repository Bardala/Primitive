import { ENDPOINT } from '@nest/shared';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import { UserController } from '../controllers/user.controller';
import { checkEmptyInput } from '../middleware/checkReqBody';

export const createAuthRoutes = (userController: UserController) => {
  const router = Router();

  router.post(ENDPOINT.SIGNUP, checkEmptyInput, asyncHandler(userController.signup));
  router.post(ENDPOINT.LOGIN, checkEmptyInput, asyncHandler(userController.login));

  return router;
};
