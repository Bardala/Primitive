import { CommentWithUser, LikedUser, Short } from '@nest/shared';

export interface ShortDao {
  createShort(short: Short): Promise<void>;
  updateShort(short: Short): Promise<void>;
  getShort(shortId: string): Promise<Short | undefined>;
  deleteShort(shortId: string): Promise<void>;

  getShComments(shortId: string): Promise<CommentWithUser[]>;
  deleteShComments(shortId: string): Promise<void>;
  shortLikes(shortId: string): Promise<number>;
  shortLikesList(shortId: string): Promise<LikedUser[]>;
}
