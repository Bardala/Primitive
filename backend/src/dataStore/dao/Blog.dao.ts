import { Blog, CommentWithUser, LikedUser } from '@nest/shared';

export interface BlogDao {
  createBlog(blog: Blog): Promise<void>;
  updateBlog(blog: Blog): Promise<void>;
  getBlog(blogId: string): Promise<Blog | undefined>;
  deleteBlog(blogId: string): Promise<void>;

  getComments(blogId: string): Promise<CommentWithUser[]>;
  getNumOfComments(blogId: string): Promise<number>;
  deleteComments(blogId: string): Promise<void>;
  blogLikes(blogId: string, userId: string): Promise<{ likes: number; isLiked: boolean }>;
  blogLikesList(blogId: string): Promise<LikedUser[]>;
  //* test
  infiniteScroll(memberId: string, pageSize: number, offset: number): Promise<Blog[]>;
}
