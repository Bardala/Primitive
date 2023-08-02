import { BlogDao } from './dao/Blog.dao';
import { CommentDao } from './dao/Comment.dao';
import { LikeDao } from './dao/Like.dao';
import { SpaceDao } from './dao/Space.dao';
import { UserDao } from './dao/User.dao';
import { ChatDao } from './dao/chat.dao';
import { FeedsDao } from './dao/feeds.dos';
import { SqlDataStore } from './sql/SqlDataStore.class';

export interface DataStoreDao
  extends UserDao,
    BlogDao,
    CommentDao,
    SpaceDao,
    LikeDao,
    ChatDao,
    FeedsDao {}

export let db: SqlDataStore;

export async function initDb() {
  db = new SqlDataStore();
  await db.runDB();
}
