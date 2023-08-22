import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import asyncHandler from 'express-async-handler';
import http from 'http';

import { ENDPOINT } from '@nest/shared';
import { BlogController } from './controllers/blog.controller';
import { CommentController } from './controllers/comment.controller';
import { SpaceController } from './controllers/space.controller';
import { UserController } from './controllers/user.controller';
import { db, initDb } from './dataStore';
import { requireAuth } from './middleware/authMiddleware';
import { errorHandler } from './middleware/errorHandler';
import { ChatController } from './controllers/chat.controller';
import { initSockets } from './Sockets.class';

(async () => {
  dotenv.config();
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
  // const short = new ShortController(db);
  // const like = new LikeController(db);

  app.use((req, res, next) => {
    console.log(req.path, req.method, req.body, req.params, res.statusCode);
    next();
  });

  app.get('/health', (_, res) => res.send('😊'));

  // *Auth Routes
  app.post(ENDPOINT.SIGNUP, asyncHandler(user.signup));
  app.post(ENDPOINT.LOGIN, asyncHandler(user.login));

  // *User
  app.get(ENDPOINT.GET_USER_CARD, requireAuth, asyncHandler(user.getUserCard));
  app.post(ENDPOINT.FOLLOW_USER, requireAuth, asyncHandler(user.createFollow));
  app.delete(ENDPOINT.UNFOLLOW_USER, requireAuth, asyncHandler(user.deleteFollow));
  app.get(ENDPOINT.GET_FOLLOWERS, requireAuth, asyncHandler(user.getFollowers));
  app.get(ENDPOINT.GET_USERS_LIST, requireAuth, asyncHandler(user.getUsersList));
  app.get(ENDPOINT.GET_USER_BLOGS, requireAuth, asyncHandler(user.getUserBlogs));
  app.get(ENDPOINT.GET_USER_SPACES, requireAuth, asyncHandler(user.getUserSpaces));

  // *Blog
  app.post(ENDPOINT.CREATE_BLOG, requireAuth, asyncHandler(blog.createBlog));
  app.put(ENDPOINT.UPDATE_BLOG, requireAuth, asyncHandler(blog.updateBlog));
  app.get(ENDPOINT.GET_BLOG, requireAuth, asyncHandler(blog.getBlog));
  app.delete(ENDPOINT.DELETE_BLOG, requireAuth, asyncHandler(blog.deleteBlog));

  app.get(ENDPOINT.GET_BLOG_COMMENTS, requireAuth, asyncHandler(blog.getBlogComments));
  app.get(ENDPOINT.GET_BLOG_LIKES, requireAuth, asyncHandler(blog.getBlogLikes));
  app.get(ENDPOINT.GET_BLOG_LIKES_LIST, requireAuth, asyncHandler(blog.getBlogLikesList));
  app.post(ENDPOINT.LIKE_BLOG, requireAuth, asyncHandler(blog.likeBlog));
  app.delete(ENDPOINT.UNLIKE_BLOG, requireAuth, asyncHandler(blog.unLikeBlog));
  app.get(ENDPOINT.TEST_INFINITE_SCROLL, requireAuth, asyncHandler(blog.testInfiniteScrollBlogs));

  //* Short
  // app.post(ENDPOINT.CREATE_SHORT, requireAuth, asyncHandler(short.createShort));
  // app.put(ENDPOINT.UPDATE_SHORT, requireAuth, asyncHandler(short.updateShort));
  // app.get(ENDPOINT.GET_SHORT, requireAuth, asyncHandler(short.getShort));
  // app.delete(ENDPOINT.DELETE_SHORT, requireAuth, asyncHandler(short.deleteShort));

  // app.get(ENDPOINT.GET_SHORT_COMMENTS, requireAuth, asyncHandler(short.shortComments));

  // *Comment
  app.post(ENDPOINT.CREATE_COMMENT, requireAuth, asyncHandler(comm.createComment));
  app.put(ENDPOINT.UPDATE_COMMENT, requireAuth, asyncHandler(comm.updateComment));
  app.delete(ENDPOINT.DELETE_COMMENT, requireAuth, asyncHandler(comm.deleteComment));

  // *Space
  app.post(ENDPOINT.CREATE_SPACE, requireAuth, asyncHandler(space.createSpace));
  app.put(ENDPOINT.UPDATE_SPACE, requireAuth, asyncHandler(space.updateSpace));
  app.get(ENDPOINT.GET_SPACE, requireAuth, asyncHandler(space.getSpace));
  app.delete(ENDPOINT.DELETE_SPACE, requireAuth, asyncHandler(space.deleteSpace));

  app.get(ENDPOINT.GET_DEFAULT_SPACE, requireAuth, asyncHandler(space.getDefaultSpace));
  app.post(ENDPOINT.JOIN_SPACE, requireAuth, asyncHandler(space.joinSpace));
  app.post(ENDPOINT.ADD_MEMBER, requireAuth, asyncHandler(space.addMember));
  app.get(ENDPOINT.GET_SPACE_MEMBERS, requireAuth, asyncHandler(space.getSpaceMembers));
  app.get(ENDPOINT.Get_SPACE_CHAT, requireAuth, asyncHandler(space.getChat));
  app.delete(ENDPOINT.DELETE_MEMBER, requireAuth, asyncHandler(space.deleteMember));
  app.delete(ENDPOINT.LEAVE_SPACE, requireAuth, asyncHandler(space.leaveSpace));
  app.get(ENDPOINT.GET_SPACE_BLOGS, requireAuth, asyncHandler(space.blogs));
  // app.get(ENDPOINT.GET_SPACE_SHORTS, requireAuth, asyncHandler(space.shorts));

  // *Like
  // app.post(ENDPOINT.LIKE_POST, requireAuth, asyncHandler(like.likePost));
  // app.delete(ENDPOINT.UNLIKE_POST, requireAuth, asyncHandler(like.unLikePost));
  // app.get(ENDPOINT.GET_POST_LIKES, requireAuth, asyncHandler(like.getPostLikes));

  //* Message
  app.post(ENDPOINT.CREATE_MESSAGE, requireAuth, asyncHandler(chat.createMessage));
  app.delete(ENDPOINT.DELETE_MESSAGE, requireAuth, asyncHandler(chat.deleteMessage));

  // *Feeds
  app.get(ENDPOINT.GET_FEEDS, requireAuth, asyncHandler(space.feeds));

  app.use(errorHandler);

  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
})();
