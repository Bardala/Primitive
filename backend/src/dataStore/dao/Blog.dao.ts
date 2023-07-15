import { Blog, Comment, Like } from "../types";

export interface BlogDao {
  createBlog(blog: Blog): Promise<void>;
  updateBlog(blog: Blog): Promise<void>;
  getBlog(blogId: string): Promise<Blog | undefined>;
  deleteBlog(blogId: string): Promise<void>;

  getBlogComments(blogId: string): Promise<Comment[]>;
  blogLikes(blogId: string): Promise<number>;
  blogLikesList(blogId: string): Promise<Like[]>;

  // todo: move this method to space doa
  getBlogs(spaceId: string): Promise<Blog[]>;
  // todo: move this method to user doa
  getUserBlogs(userId: string): Promise<Blog[]>;
}
