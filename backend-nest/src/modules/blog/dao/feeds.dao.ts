import { Blog } from '../entities';

export interface FeedsDao {
  getFeeds(memberId: string, pageSize: number, offset: number): Promise<Blog[]>;
  getPublicFeeds(pageSize: number, offset: number): Promise<Blog[]>;
  getSmartFeeds(memberId: string, pageSize: number, offset: number): Promise<Blog[]>;
  getSmartPublicFeeds(pageSize: number, offset: number): Promise<Blog[]>;
  getNetworkblogs(userId: string, blogCount: number): Promise<Pick<Blog, 'id' | 'userId' | 'timestamp'>[]>;
}
