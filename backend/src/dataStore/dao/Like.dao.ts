import { Like } from "../../../../shared/src/types";

export interface LikeDao {
  createLike(like: Like): Promise<void>;
  removeLike(like: Like): Promise<void>; // by req.params.blogId, res.locals.userId
}
