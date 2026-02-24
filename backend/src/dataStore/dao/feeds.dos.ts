import { Blog } from '@nest/shared';

export interface FeedsDao {
  // getFeeds(userId: string): Promise<Blog[]>;
  getFeeds(memberId: string, pageSize: number, offset: number): Promise<Blog[]>;
  getPublicFeeds(pageSize: number, offset: number): Promise<Blog[]>;
  getSmartFeeds(memberId: string, pageSize: number, offset: number): Promise<Blog[]>;
  getSmartPublicFeeds(pageSize: number, offset: number): Promise<Blog[]>;
}
