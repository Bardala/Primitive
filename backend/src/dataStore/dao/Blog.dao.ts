import { Blog, Comment, LikedUser } from '@nest/shared';

export interface BlogDao {
  createBlog(blog: Blog): Promise<void>;
  updateBlog(blog: Blog): Promise<void>;
  getBlog(blogId: string): Promise<Blog | undefined>;
  deleteBlog(blogId: string): Promise<void>;

  getComments(blogId: string): Promise<Comment[]>;
  deleteComments(blogId: string): Promise<void>;
  blogLikes(blogId: string): Promise<number>;
  blogLikesList(blogId: string): Promise<LikedUser[]>;
}
