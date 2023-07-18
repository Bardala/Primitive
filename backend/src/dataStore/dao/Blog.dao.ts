import { Blog, Like, Comment } from "../../../../shared/src/types";

export interface BlogDao {
  createBlog(blog: Blog): Promise<void>;
  updateBlog(blog: Blog): Promise<void>;
  getBlog(blogId: string): Promise<Blog | undefined>;
  deleteBlog(blogId: string): Promise<void>;

  getBlogComments(blogId: string): Promise<Comment[]>;
  blogLikes(blogId: string): Promise<number>;
  blogLikesList(blogId: string): Promise<Like[]>;
}
