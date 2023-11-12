import { ENDPOINT } from '@nest/shared';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import asyncHandler from 'express-async-handler';
import http from 'http';

import { initSockets } from './Sockets.class';
import { BlogController } from './controllers/blog.controller';
import { ChatController } from './controllers/chat.controller';
import { CommentController } from './controllers/comment.controller';
import { SpaceController } from './controllers/space.controller';
import { UserController } from './controllers/user.controller';
import { db, initDb } from './dataStore';
import { requireAuth } from './middleware/authMiddleware';
import { checkEmptyInput } from './middleware/checkReqBody';
import { errorHandler } from './middleware/errorHandler';

(async () => {
  dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
  await initDb();

  const app = express();
  const port = process.env.PORT;
  const server = http.createServer(app);
  app.use(express.static('public'));

  initSockets(server);

  app.use(express.json());
  app.use(cors());

  const user = new UserController(db);
  const blog = new BlogController(db);
  const space = new SpaceController(db);
  const comm = new CommentController(db);
  const chat = new ChatController(db);

  app.get('/health', (_, res) => res.send('😊'));

  // *Auth Routes
  app.post(ENDPOINT.SIGNUP, checkEmptyInput, asyncHandler(user.signup));
  app.post(ENDPOINT.LOGIN, checkEmptyInput, asyncHandler(user.login));

  // *User
  app.get(ENDPOINT.GET_USER_CARD, requireAuth, asyncHandler(user.getUserCard));
  app.post(ENDPOINT.FOLLOW_USER, requireAuth, checkEmptyInput, asyncHandler(user.createFollow));
  app.delete(ENDPOINT.UNFOLLOW_USER, requireAuth, asyncHandler(user.deleteFollow));
  app.get(ENDPOINT.GET_FOLLOWERS, requireAuth, asyncHandler(user.getFollowers));
  app.get(ENDPOINT.GET_USERS_LIST, requireAuth, asyncHandler(user.getUsersList));
  app.get(ENDPOINT.GET_USER_BLOGS, requireAuth, asyncHandler(user.getUserBlogs));
  app.get(ENDPOINT.GET_USER_SPACES, requireAuth, asyncHandler(user.getUserSpaces));
  app.get(ENDPOINT.GET_ALL_UNREAD_MSGS, requireAuth, asyncHandler(user.getAllUnReadMsgs));

  // *Blog
  app.post(ENDPOINT.CREATE_BLOG, requireAuth, checkEmptyInput, asyncHandler(blog.createBlog));
  app.put(ENDPOINT.UPDATE_BLOG, requireAuth, checkEmptyInput, asyncHandler(blog.updateBlog));
  app.get(ENDPOINT.GET_BLOG, requireAuth, asyncHandler(blog.getBlog));
  app.delete(ENDPOINT.DELETE_BLOG, requireAuth, asyncHandler(blog.deleteBlog));

  app.get(ENDPOINT.GET_BLOG_COMMENTS, requireAuth, asyncHandler(blog.getBlogComments));
  app.get(ENDPOINT.GET_BLOG_LIKES, requireAuth, asyncHandler(blog.getBlogLikes));
  app.get(ENDPOINT.GET_BLOG_LIKES_LIST, requireAuth, asyncHandler(blog.getBlogLikesList));
  app.post(ENDPOINT.LIKE_BLOG, requireAuth, checkEmptyInput, asyncHandler(blog.likeBlog));
  app.delete(ENDPOINT.UNLIKE_BLOG, requireAuth, asyncHandler(blog.unLikeBlog));
  app.get(ENDPOINT.TEST_INFINITE_SCROLL, requireAuth, asyncHandler(blog.testInfiniteScrollBlogs));

  // *Comment
  app.post(ENDPOINT.CREATE_COMMENT, requireAuth, checkEmptyInput, asyncHandler(comm.createComment));
  app.put(ENDPOINT.UPDATE_COMMENT, requireAuth, checkEmptyInput, asyncHandler(comm.updateComment));
  app.delete(ENDPOINT.DELETE_COMMENT, requireAuth, asyncHandler(comm.deleteComment));

  // *Space
  app.post(ENDPOINT.CREATE_SPACE, requireAuth, checkEmptyInput, asyncHandler(space.createSpace));
  app.put(ENDPOINT.UPDATE_SPACE, requireAuth, checkEmptyInput, asyncHandler(space.updateSpace));
  app.get(ENDPOINT.GET_SPACE, requireAuth, asyncHandler(space.getSpace));
  app.delete(ENDPOINT.DELETE_SPACE, requireAuth, asyncHandler(space.deleteSpace));

  app.get(ENDPOINT.GET_DEFAULT_SPACE, requireAuth, asyncHandler(space.getDefaultSpace));
  app.post(ENDPOINT.JOIN_SPACE, requireAuth, checkEmptyInput, asyncHandler(space.joinSpace));
  app.post(ENDPOINT.ADD_MEMBER, requireAuth, checkEmptyInput, asyncHandler(space.addMember));
  app.get(ENDPOINT.GET_SPACE_MEMBERS, requireAuth, asyncHandler(space.getSpaceMembers));
  app.get(ENDPOINT.Get_SPACE_CHAT, requireAuth, asyncHandler(space.getChat));
  app.delete(ENDPOINT.DELETE_MEMBER, requireAuth, asyncHandler(space.deleteMember));
  app.delete(ENDPOINT.LEAVE_SPACE, requireAuth, asyncHandler(space.leaveSpace));
  app.get(ENDPOINT.GET_SPACE_BLOGS, requireAuth, asyncHandler(space.blogs));
  app.get(ENDPOINT.GET_UNREAD_MSGS_NUM, requireAuth, asyncHandler(space.getNumOfUnReadMsgs));

  //* Message
  app.post(ENDPOINT.CREATE_MESSAGE, requireAuth, checkEmptyInput, asyncHandler(chat.createMessage));
  app.delete(ENDPOINT.DELETE_MESSAGE, requireAuth, asyncHandler(chat.deleteMessage));

  // *Feeds
  app.get(ENDPOINT.GET_FEEDS, requireAuth, asyncHandler(space.feeds)); // closed
  app.get(ENDPOINT.GET_FEEDS_PAGE, requireAuth, asyncHandler(space.feedsPagination));
  app.use(errorHandler);

  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
})();
