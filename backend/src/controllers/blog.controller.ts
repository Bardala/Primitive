import {
  Blog,
  BlogCommentsReq,
  BlogCommentsRes,
  BlogLikesListReq,
  BlogLikesListRes,
  BlogLikesReq,
  BlogLikesRes,
  BlogReq,
  BlogRes,
  CommentWithUser,
  CreateBlogReq,
  CreateBlogRes,
  CreateLikeReq,
  CreateLikeRes,
  DeleteBlogReq,
  DeleteBlogRes,
  ERROR,
  Like,
  LikedUser,
  NumOfCommentsReq,
  NumOfCommentsRes,
  RemoveLikeReq,
  RemoveLikeRes,
  SpaceBlogsReq,
  SpaceBlogsRes,
  updateBlogReq,
  updateBlogRes,
} from '@nest/shared';
import { randomUUID } from 'node:crypto';

import { DataStoreDao } from '../dataStore';
import { HTTP } from '../httpStatusCodes';
import { Handler, HandlerWithParams } from '../types';

// * Controller Interface
export interface blogController {
  createBlog: Handler<CreateBlogReq, CreateBlogRes>;
  updateBlog: HandlerWithParams<{ blogId: string }, updateBlogReq, updateBlogRes>;
  getBlog: HandlerWithParams<{ blogId: string }, BlogReq, BlogRes>;
  deleteBlog: HandlerWithParams<{ blogId: string }, DeleteBlogReq, DeleteBlogRes>;

  getBlogComments: HandlerWithParams<{ blogId: string }, BlogCommentsReq, BlogCommentsRes>;
  likeBlog: HandlerWithParams<{ blogId: string }, CreateLikeReq, CreateLikeRes>;
  unLikeBlog: HandlerWithParams<{ blogId: string }, RemoveLikeReq, RemoveLikeRes>;
  getBlogLikes: HandlerWithParams<{ blogId: string }, BlogLikesReq, BlogLikesRes>;
  getBlogLikesList: HandlerWithParams<{ blogId: string }, BlogLikesListReq, BlogLikesListRes>;
  getNumOfComments: HandlerWithParams<{ blogId: string }, NumOfCommentsReq, NumOfCommentsRes>;
}

export class BlogController implements blogController {
  private db: DataStoreDao;

  constructor(db: DataStoreDao) {
    this.db = db;
  }

  getNumOfComments: HandlerWithParams<{ blogId: string }, NumOfCommentsReq, NumOfCommentsRes> =
    async (req, res) => {
      const blogId = req.params.blogId;
      if (!blogId) return res.status(400).send({ error: ERROR.PARAMS_MISSING });

      const numOfComments = await this.db.getNumOfComments(blogId);
      return res.status(200).send({ numOfComments });
    };

  likeBlog: HandlerWithParams<{ blogId: string }, CreateLikeReq, CreateLikeRes> = async (
    req,
    res
  ) => {
    const blogId = req.params.blogId;
    const userId = res.locals.userId;

    if (!blogId) return res.status(400).send({ error: ERROR.PARAMS_MISSING });
    const blog = await this.db.getBlog(blogId);
    if (!blog) return res.status(400).send({ error: ERROR.BLOG_NOT_FOUND });
    if (!(await this.db.isMember(blog.spaceId, userId)))
      return res.status(403).send({ error: ERROR.PRIVATE_BLOG });

    const like: Like = { blogId, userId };
    if (await this.db.isLiked(like)) return res.sendStatus(409);

    await this.db.createLike(like);
    return res.sendStatus(200);
  };

  unLikeBlog: HandlerWithParams<{ blogId: string }, RemoveLikeReq, RemoveLikeRes> = async (
    req,
    res
  ) => {
    const blogId = req.params.blogId;
    const userId = res.locals.userId;

    if (!blogId) return res.status(400).send({ error: ERROR.PARAMS_MISSING });
    const blog = await this.db.getBlog(blogId);
    if (!blog) return res.status(400).send({ error: ERROR.BLOG_NOT_FOUND });
    if (!(await this.db.isMember(blog.spaceId, userId))) return res.sendStatus(403);

    const like: Like = { blogId, userId };
    if (!(await this.db.isLiked(like))) return res.sendStatus(409);

    await this.db.removeLike(like);
    return res.sendStatus(200);
  };

  getBlogLikes: HandlerWithParams<{ blogId: string }, BlogLikesReq, BlogLikesRes> = async (
    req,
    res
  ) => {
    const blogId = req.params.blogId;

    if (!blogId) return res.status(400).send({ error: ERROR.PARAMS_MISSING });
    if (!(await this.db.getBlog(blogId))) return res.sendStatus(404);

    const { likes, isLiked } = await this.db.blogLikes(blogId, res.locals.userId);

    return res.status(200).send({ likes, isLiked });
  };

  getBlogLikesList: HandlerWithParams<{ blogId: string }, BlogLikesListReq, BlogLikesListRes> =
    async (req, res) => {
      const blogId = req.params.blogId;

      if (!blogId) return res.status(400).send({ error: ERROR.PARAMS_MISSING });
      const blog: Blog | undefined = await this.db.getBlog(blogId);
      if (!blog) return res.status(404).send({ error: ERROR.BLOG_NOT_FOUND });
      if (
        (await this.db.getSpace(blog?.spaceId))?.status === 'private' &&
        !(await this.db.isMember(blog?.spaceId, res.locals.userId))
      )
        return res.status(HTTP.FORBIDDEN).send({ error: ERROR.PRIVATE_BLOG });

      const users: LikedUser[] = await this.db.blogLikesList(blogId);
      return res.status(200).send({ users });
    };

  updateBlog: HandlerWithParams<{ blogId: string }, updateBlogReq, updateBlogRes> = async (
    req,
    res
  ) => {
    const userId = res.locals.userId;
    const blogId = req.params.blogId;
    const { content, title } = req.body;

    if (!blogId) return res.status(400).send({ error: ERROR.PARAMS_MISSING });
    if (!content || !title) return res.status(400).send({ error: ERROR.ALL_FIELDS_REQUIRED });
    let blog = await this.db.getBlog(blogId);
    if (!blog) return res.status(400).send({ error: ERROR.BLOG_NOT_FOUND });
    if (blog.userId !== userId) return res.sendStatus(403);

    blog = { id: blogId, content, title, userId, spaceId: blog.spaceId };

    await this.db.updateBlog(blog);
    return res.sendStatus(200);
  };

  getBlog: HandlerWithParams<{ blogId: string }, BlogReq, BlogRes> = async (req, res) => {
    const blogId = req.params.blogId;

    if (!blogId) return res.status(400).send({ error: ERROR.PARAMS_MISSING });

    const blog: Blog | undefined = await this.db.getBlog(blogId);
    if (!blog) return res.status(404).send({ error: ERROR.BLOG_NOT_FOUND });
    if (
      (await this.db.getSpace(blog.spaceId))?.status === 'private' &&
      !(await this.db.isMember(blog?.spaceId, res.locals.userId))
    )
      return res.status(HTTP.FORBIDDEN).send({ error: ERROR.PRIVATE_BLOG });

    return res.status(200).send({ blog });
  };

  getBlogComments: HandlerWithParams<{ blogId: string }, BlogCommentsReq, BlogCommentsRes> = async (
    req,
    res
  ) => {
    const blogId = req.params.blogId;
    if (!blogId) return res.status(400).send({ error: ERROR.PARAMS_MISSING });
    const blog: Blog | undefined = await this.db.getBlog(blogId);
    if (!blog) return res.status(404).send({ error: ERROR.BLOG_NOT_FOUND });
    if (
      (await this.db.getSpace(blog?.spaceId))?.status === 'private' &&
      !(await this.db.isMember(blog?.spaceId, res.locals.userId))
    )
      return res.status(HTTP.FORBIDDEN).send({ error: ERROR.PRIVATE_BLOG });

    const comments: CommentWithUser[] = await this.db.getComments(blogId);
    return res.status(200).send({ comments });
  };

  createBlog: Handler<CreateBlogReq, CreateBlogRes> = async (req, res) => {
    const userId = res.locals.userId;

    const { title, content, spaceId } = req.body;
    const user = await this.db.getUserById(userId);

    if (!title || !content || !spaceId)
      return res.status(400).send({ error: ERROR.ALL_FIELDS_REQUIRED });
    if (!user) return res.status(400).send({ error: ERROR.USER_NOT_FOUND });
    if (
      // (await this.db.getSpace(spaceId))?.status === 'private' &&
      !(await this.db.isMember(spaceId, res.locals.userId))
    )
      return res.sendStatus(403);

    const blog: Blog = {
      title,
      id: randomUUID(),
      content,
      spaceId,
      userId,
      author: user.username,
      timestamp: Date.now(),
    };

    await this.db.createBlog(blog);
    return res.status(200).send({ blog });
  };

  deleteBlog: HandlerWithParams<{ blogId: string }, DeleteBlogReq, DeleteBlogRes> = async (
    req,
    res
  ) => {
    const blogId = req.params.blogId;

    if (!blogId) return res.status(400).send({ error: ERROR.PARAMS_MISSING });
    const blog = await this.db.getBlog(blogId);
    if (!blog) return res.sendStatus(404);
    if (blog.userId !== res.locals.userId) return res.sendStatus(403);

    await this.db.deleteBlog(blogId);
    return res.sendStatus(200);
  };

  // * Just for testing
  testInfiniteScrollBlogs: HandlerWithParams<
    { page: string; pageSize: string },
    SpaceBlogsReq,
    SpaceBlogsRes
  > = async (req, res) => {
    if (!req.params.page || !req.params.pageSize)
      return res.status(400).send({ error: ERROR.PARAMS_MISSING });

    const page = parseInt(req.params.page);
    const pageSize = parseInt(req.params.pageSize);

    const offset = (page - 1) * pageSize;

    const blogs = await this.db.infiniteScroll(res.locals.userId, pageSize, offset);
    return res.status(200).send({ blogs });
  };
}
