import { Blog } from '@nest/shared';

export interface FeedsDao {
  getFeeds(userId: string): Promise<Blog[]>;
}
