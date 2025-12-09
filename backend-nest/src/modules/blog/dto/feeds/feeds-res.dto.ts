import { FeedsRes } from '@nest/shared';
import { Blog } from '../../entities';

export class Feed {
  id: string;
  title: string;
  userId: string;
  spaceId: string;
  author: string;
  timestamp: number;
  content: string;

  constructor(blog: Blog) {
    this.id = blog.id;
    this.title = blog.title;
    this.userId = blog.userId;
    this.spaceId = blog.spaceId;
    this.author = blog.author;
    this.timestamp = blog.timestamp;
    this.content = blog.content;
  }
}

export class FeedsResDto implements FeedsRes {
  feeds: Blog[];
  page: number;

  constructor(feeds: Blog[], page: number) {
    this.feeds = feeds;
    this.page = page;
  }
}
