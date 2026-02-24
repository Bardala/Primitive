import { LikePostRes, UnLikePostRes, GetPostLikesRes } from '../../dto';

/**
 * ILikeService interface
 * Responsibility: Handle like/unlike operations on blogs
 */
export interface ILikeService {
  likePost(userId: string, postId: string): Promise<LikePostRes>;
  unlikePost(userId: string, postId: string): Promise<UnLikePostRes>;
  getPostLikes(postId: string): Promise<GetPostLikesRes>;
}
