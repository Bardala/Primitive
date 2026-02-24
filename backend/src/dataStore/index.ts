import { BlogDao } from './dao/Blog.dao';
import { BlogSeriesDao } from './dao/BlogSeries.dao';
import { CommentDao } from './dao/Comment.dao';
import { FollowDao } from './dao/Follow.dao';
import { LastReadDao } from './dao/LastRead.dao';
import { LikeDao } from './dao/Like.dao';
import { MemberDao } from './dao/Member.dao';
import { NotificationDao } from './dao/Notification.dao';
import { PrivateConversationDao } from './dao/PrivateConversation.dao';
import { PrivateMessageDao } from './dao/PrivateMessage.dao';
import { SpaceDao } from './dao/Space.dao';
import { SpacePermissionDao } from './dao/SpacePermission.dao';
import { TagDao } from './dao/Tag.dao';
import { UserDao } from './dao/User.dao';
import { UserActivityDao } from './dao/UserActivity.dao';
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
    FeedsDao,
    BlogSeriesDao,
    NotificationDao,
    PrivateConversationDao,
    PrivateMessageDao,
    FollowDao,
    TagDao,
    LastReadDao,
    MemberDao,
    SpacePermissionDao,
    UserActivityDao {}

export let db: SqlDataStore;

export async function initDb() {
  db = new SqlDataStore();
  await db.runDB();
}
