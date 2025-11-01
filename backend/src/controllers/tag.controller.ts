import {
  AddBlogTagReq,
  AddBlogTagRes,
  AddSpaceTagReq,
  AddSpaceTagRes,
  AddUserTagReq,
  AddUserTagRes,
  CreateTagReq,
  CreateTagRes,
  ERROR,
  GetAllTagsRes,
  GetBlogTagsReq,
  GetBlogTagsRes,
  GetSpaceTagsReq,
  GetSpaceTagsRes,
  GetUserTagsReq,
  GetUserTagsRes,
  RemoveBlogTagReq,
  RemoveBlogTagRes,
  RemoveSpaceTagReq,
  RemoveSpaceTagRes,
  Tag,
} from '@nest/shared';
import { randomUUID } from 'node:crypto';

import { DataStoreDao } from '../dataStore';
import { Handler, HandlerWithParams } from '../types';

export interface TagController {
  createTag: Handler<CreateTagReq, CreateTagRes>;
  getAllTags: Handler<{}, GetAllTagsRes>;

  addBlogTag: HandlerWithParams<{ blogId: string }, AddBlogTagReq, AddBlogTagRes>;
  removeBlogTag: HandlerWithParams<
    { blogId: string; tagId: string },
    RemoveBlogTagReq,
    RemoveBlogTagRes
  >;
  getBlogTags: HandlerWithParams<{ blogId: string }, GetBlogTagsReq, GetBlogTagsRes>;

  addSpaceTag: HandlerWithParams<{ spaceId: string }, AddSpaceTagReq, AddSpaceTagRes>;
  removeSpaceTag: HandlerWithParams<
    { spaceId: string; tagId: string },
    RemoveSpaceTagReq,
    RemoveSpaceTagRes
  >;
  getSpaceTags: HandlerWithParams<{ spaceId: string }, GetSpaceTagsReq, GetSpaceTagsRes>;

  addUserTag: Handler<AddUserTagReq, AddUserTagRes>;
  removeUserTag: Handler<AddUserTagReq, AddUserTagRes>;
  getUserTags: Handler<GetUserTagsReq, GetUserTagsRes>;
}

export class TagControllerImpl implements TagController {
  private db: DataStoreDao;

  constructor(db: DataStoreDao) {
    this.db = db;
  }

  addUserTag: Handler<AddUserTagReq, AddUserTagRes> = async (req, res) => {
    const { userId } = res.locals;
    const { tagName } = req.body;
    if (!tagName) return res.status(400).send({ error: ERROR.ALL_FIELDS_REQUIRED });

    let tag = await this.db.getTagByName(tagName);

    if (!tag) return res.status(404).send({ error: ERROR.TAG_NOT_FOUND });
    await this.db.addUserTag({ tagId: tag.id, userId });
  };

  removeUserTag: HandlerWithParams<{}, AddUserTagReq, AddUserTagRes> = async (req, res) => {
    const { userId } = res.locals;
    const { tagName } = req.body;
    if (!tagName) return res.status(400).send({ error: ERROR.ALL_FIELDS_REQUIRED });

    let tag = await this.db.getTagByName(tagName);

    if (!tag) return res.status(404).send({ error: ERROR.TAG_NOT_FOUND });
    await this.db.removeUserTag({ tagId: tag.id, userId });
  };

  getUserTags: Handler<GetUserTagsReq, GetUserTagsRes> = async (_req, res) => {
    const { userId } = res.locals;
    const tags: Tag[] = await this.db.getUserTags(userId);
    return res.status(200).send({ tags });
  };

  createTag: Handler<CreateTagReq, CreateTagRes> = async (req, res) => {
    const { tagName } = req.body;
    if (!tagName) return res.status(400).send({ error: ERROR.ALL_FIELDS_REQUIRED });

    const existingTag = await this.db.getTagByName(tagName);
    if (existingTag) return res.status(409).send({ error: ERROR.TAG_ALREADY_EXISTS });

    const tag: Tag = {
      id: randomUUID(),
      name: tagName.toLowerCase().trim(),
    };

    await this.db.createTag(tag);
    return res.status(200).send({ tag });
  };

  getAllTags: Handler<{}, GetAllTagsRes> = async (_req, res) => {
    const tags = await this.db.getAllTags();
    return res.status(200).send({ tags });
  };

  addBlogTag: HandlerWithParams<{ blogId: string }, AddBlogTagReq, AddBlogTagRes> = async (
    req,
    res
  ) => {
    const blogId = req.params.blogId;
    const { tagName } = req.body;

    if (!blogId || !tagName) return res.status(400).send({ error: ERROR.PARAMS_MISSING });

    const blog = await this.db.getBlog(blogId);
    if (!blog) return res.status(404).send({ error: ERROR.BLOG_NOT_FOUND });

    if (blog.userId !== res.locals.userId) {
      return res.status(403).send({ error: ERROR.PERMISSION_DENIED });
    }

    let tag = await this.db.getTagByName(tagName);
    if (!tag) {
      tag = {
        id: randomUUID(),
        name: tagName.toLowerCase().trim(),
      };
      await this.db.createTag(tag);
    }

    await this.db.addBlogTag({ blogId, tagId: tag.id });
    return res.sendStatus(200);
  };

  removeBlogTag: HandlerWithParams<
    { blogId: string; tagId: string },
    RemoveBlogTagReq,
    RemoveBlogTagRes
  > = async (req, res) => {
    const { blogId, tagId } = req.params;

    if (!blogId || !tagId) return res.status(400).send({ error: ERROR.PARAMS_MISSING });

    const blog = await this.db.getBlog(blogId);
    if (!blog) return res.status(404).send({ error: ERROR.BLOG_NOT_FOUND });

    if (blog.userId !== res.locals.userId) {
      return res.status(403).send({ error: ERROR.PERMISSION_DENIED });
    }

    await this.db.removeBlogTag({ blogId, tagId });
    return res.sendStatus(200);
  };

  getBlogTags: HandlerWithParams<{ blogId: string }, GetBlogTagsReq, GetBlogTagsRes> = async (
    req,
    res
  ) => {
    const blogId = req.params.blogId;
    if (!blogId) return res.status(400).send({ error: ERROR.PARAMS_MISSING });

    const blog = await this.db.getBlog(blogId);
    if (!blog) return res.status(404).send({ error: ERROR.BLOG_NOT_FOUND });

    const tags = await this.db.getBlogTags(blogId);
    return res.status(200).send({ tags });
  };

  addSpaceTag: HandlerWithParams<{ spaceId: string }, AddSpaceTagReq, AddSpaceTagRes> = async (
    req,
    res
  ) => {
    const spaceId = req.params.spaceId;
    const { tagName } = req.body;

    if (!spaceId || !tagName) return res.status(400).send({ error: ERROR.PARAMS_MISSING });

    const space = await this.db.getSpace(spaceId);
    if (!space) return res.status(404).send({ error: ERROR.SPACE_NOT_FOUND });

    // Only space admin/owner can add tags
    const isAdmin = await this.db.isSpaceAdmin(spaceId, res.locals.userId);
    if (space.ownerId !== res.locals.userId && !isAdmin) {
      return res.status(403).send({ error: ERROR.PERMISSION_DENIED });
    }

    let tag = await this.db.getTagByName(tagName);
    if (!tag) {
      tag = {
        id: randomUUID(),
        name: tagName.toLowerCase().trim(),
      };
      await this.db.createTag(tag);
    }

    await this.db.addSpaceTag({ spaceId, tagId: tag.id });
    return res.sendStatus(200);
  };

  removeSpaceTag: HandlerWithParams<
    { spaceId: string; tagId: string },
    RemoveSpaceTagReq,
    RemoveSpaceTagRes
  > = async (req, res) => {
    const { spaceId, tagId } = req.params;

    if (!spaceId || !tagId) return res.status(400).send({ error: ERROR.PARAMS_MISSING });

    const space = await this.db.getSpace(spaceId);
    if (!space) return res.status(404).send({ error: ERROR.SPACE_NOT_FOUND });

    const isAdmin = await this.db.isSpaceAdmin(spaceId, res.locals.userId);
    if (space.ownerId !== res.locals.userId && !isAdmin) {
      return res.status(403).send({ error: ERROR.PERMISSION_DENIED });
    }

    await this.db.removeSpaceTag({ spaceId, tagId });
    return res.sendStatus(200);
  };

  getSpaceTags: HandlerWithParams<{ spaceId: string }, GetSpaceTagsReq, GetSpaceTagsRes> = async (
    req,
    res
  ) => {
    const spaceId = req.params.spaceId;
    if (!spaceId) return res.status(400).send({ error: ERROR.PARAMS_MISSING });

    const space = await this.db.getSpace(spaceId);
    if (!space) return res.status(404).send({ error: ERROR.SPACE_NOT_FOUND });

    const tags = await this.db.getSpaceTags(spaceId);
    return res.status(200).send({ tags });
  };
}
