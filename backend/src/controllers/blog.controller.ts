import {
  BlogCommentsReq,
  BlogCommentsRes,
  BlogLikesListReq,
  BlogLikesListRes,
  BlogLikesReq,
  BlogLikesRes,
  BlogReq,
  BlogRes,
  CreateBlogReq,
  CreateBlogRes,
  DeleteBlogReq,
  DeleteBlogRes,
  blogController,
  updateBlogReq,
  updateBlogRes,
} from "../apiTypes/blog.api.types";
import { DataStoreDao } from "../dataStore";
import {
  Blog,
  Comment,
  Handler,
  HandlerWithParams,
  Like,
} from "../dataStore/types";
import { Errors } from "../errors";
import { HTTP } from "../httpStatusCodes";

export class BlogController implements blogController {
  private db;

  constructor(db: DataStoreDao) {
    this.db = db;
  }

  updateBlog: HandlerWithParams<
    { blogId: string },
    updateBlogReq,
    updateBlogRes
  > = async (req, res) => {
    const userId = res.locals.userId;
    const blogId = req.params.blogId;
    const { content, title, spaceId } = req.body;

    if (!blogId) return res.status(400).send({ error: Errors.PARAMS_MISSING });
    if (!content || !title || !spaceId)
      return res.status(400).send({ error: Errors.ALL_FIELDS_REQUIRED });
    if (!(await this.db.getBlog(blogId))) return res.sendStatus(404);

    const blog: Blog = { id: blogId, content, title, userId, spaceId };

    await this.db.updateBlog(blog);
    return res.sendStatus(200);
  };

  getBlog: HandlerWithParams<{ blogId: string }, BlogReq, BlogRes> = async (
    req,
    res,
  ) => {
    const blogId = req.params.blogId;

    if (!blogId) return res.status(400).send({ error: Errors.PARAMS_MISSING });

    const blog: Blog | undefined = await this.db.getBlog(blogId);

    if (!blog) return res.sendStatus(HTTP.NOT_FOUND);

    return res.status(200).send({ blog });
  };

  getBlogComments: HandlerWithParams<
    { blogId: string },
    BlogCommentsReq,
    BlogCommentsRes
  > = async (req, res) => {
    const blogId = req.params.blogId;
    if (!blogId) return res.status(400).send({ error: Errors.PARAMS_MISSING });
    if (!(await this.db.getBlog(blogId))) return res.sendStatus(404);

    const comments: Comment[] = await this.db.getBlogComments(blogId);

    res.status(200).send({ comments });
  };

  getBlogLikes: HandlerWithParams<
    { blogId: string },
    BlogLikesReq,
    BlogLikesRes
  > = async (req, res) => {
    const blogId = req.params.blogId;

    if (!blogId) return res.status(400).send({ error: Errors.PARAMS_MISSING });
    if (!(await this.db.getBlog(blogId))) return res.sendStatus(404);

    const likesNums: number = await this.db.blogLikes(blogId);
    return res.status(200).send({ likesNums });
  };

  getBlogLikesList: HandlerWithParams<
    { blogId: string },
    BlogLikesListReq,
    BlogLikesListRes
  > = async (req, res) => {
    const blogId = req.params.blogId;

    if (!blogId) return res.status(400).send({ error: Errors.PARAMS_MISSING });
    if (!(await this.db.getBlog(blogId))) return res.sendStatus(404);

    const likes: Like[] = await this.db.blogLikesList(blogId);
    res.status(200).send({ likes });
  };

  createBlog: Handler<CreateBlogReq, CreateBlogRes> = async (req, res) => {
    const userId = res.locals.userId;

    const { title, content, spaceId } = req.body;

    if (!title || !content || !spaceId)
      return res.status(400).send({ error: Errors.ALL_FIELDS_REQUIRED });

    const blog: Blog = {
      title,
      id: crypto.randomUUID(),
      content,
      spaceId,
      userId,
    };

    await this.db.createBlog(blog);
    return res.sendStatus(200);
  };

  deleteBlog: HandlerWithParams<
    { blogId: string },
    DeleteBlogReq,
    DeleteBlogRes
  > = async (req, res) => {
    const blogId = req.params.blogId;

    if (!blogId) return res.status(400).send({ error: Errors.PARAMS_MISSING });
    if (!(await this.db.getBlog(blogId))) return res.sendStatus(404);

    await this.db.deleteBlog(blogId);

    return res.sendStatus(200);
  };
}
