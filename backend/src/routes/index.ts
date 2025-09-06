import { Router } from 'express';

import { BlogController } from '../controllers/blog.controller';
import { ChatController } from '../controllers/chat.controller';
import { CommentController } from '../controllers/comment.controller';
import { SpaceController } from '../controllers/space.controller';
import { UserController } from '../controllers/user.controller';
import { createAuthRoutes } from './auth.routes';
import { createBlogRoutes } from './blog.routes';
import { createChatRoutes } from './chat.routes';
import { createCommentRoutes } from './comment.routes';
import { createSpaceRoutes } from './space.routes';
import { createUserRoutes } from './user.routes';

export const createRoutes = (
  userController: UserController,
  blogController: BlogController,
  commentController: CommentController,
  spaceController: SpaceController,
  chatController: ChatController
) => {
  const router = Router();

  router.use('/', createAuthRoutes(userController));
  router.use('/', createUserRoutes(userController));
  router.use('/', createBlogRoutes(blogController));
  router.use('/', createCommentRoutes(commentController));
  router.use('/', createSpaceRoutes(spaceController));
  router.use('/', createChatRoutes(chatController));

  return router;
};
