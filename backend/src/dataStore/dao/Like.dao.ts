import { Like } from '../../../../shared/src/types';

export interface LikeDao {
  createLike(like: Like): Promise<void>;
  removeLike(like: Like): Promise<void>;
  deleteBlogLikes(blogId: string): Promise<void>;
  isLiked(like: Like): Promise<boolean>;
}
