import {
  CreateBlogReq,
  CreateBlogRes,
  BlogRes,
  DeleteBlogRes,
  BlogCommentsRes,
  CreateLikeRes,
  RemoveLikeRes,
  BlogLikesRes,
  BlogLikesListRes,
  NumOfCommentsRes,
  UpdateBlogReq,
  UpdateBlogRes,
} from '../../dto';

export interface IBlogService {
  createBlog(userId: string, req: CreateBlogReq): Promise<CreateBlogRes>;
  updateBlog(userId: string, blogId: string, req: UpdateBlogReq): Promise<UpdateBlogRes>;
  getBlog(userId: string | undefined, blogId: string): Promise<BlogRes>;
  deleteBlog(userId: string, blogId: string): Promise<DeleteBlogRes>;

  getBlogComments(userId: string | undefined, blogId: string): Promise<BlogCommentsRes>;
  getNumOfComments(blogId: string): Promise<NumOfCommentsRes>;

  likeBlog(userId: string, blogId: string): Promise<CreateLikeRes>;
  unlikeBlog(userId: string, blogId: string): Promise<RemoveLikeRes>;
  getBlogLikes(userId: string | undefined, blogId: string): Promise<BlogLikesRes>;
  getBlogLikesList(userId: string | undefined, blogId: string): Promise<BlogLikesListRes>;
}
