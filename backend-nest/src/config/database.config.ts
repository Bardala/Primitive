import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../modules/user/entities/user.entity';
import { UserActivity } from '../modules/user/entities/user-activity.entity';
import { Blog } from '../modules/blog/entities/blog.entity';
import { BlogSeries } from '../modules/blog/entities/blog-series.entity';
import { BlogSeriesLink } from '../modules/blog/entities/blog-series-links.entity';
import { BlogTag } from '../modules/blog/entities/blog-tag.entity';
import { Space } from '../modules/space/entities/space.entity';
import { Member } from '../modules/space/entities/member.entity';
import { SpacePermission } from '../modules/space/entities/space-permission.entity';
import { Comment } from '../modules/comment/entities/comment.entity';
import { ChatMessage } from '../modules/chat/entities/chat-message.entity';
import { PrivateConversation } from '../modules/chat/entities/private-conversation.entity';
import { PrivateMessage } from '../modules/chat/entities/private-message.entity';
import { UserConversationState } from '../modules/chat/entities/user-conversation-state.entity';
import { LastRead } from '../modules/chat/entities/last-read.entity';
import { Notification } from '../modules/notification/entities/notification.entity';
import { Tag } from '../modules/shared/entities/tag.entity';
import { Like } from '../modules/shared/entities/like.entity';
import { Follow } from '../modules/shared/entities/follow.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.MYSQLHOST || 'localhost',
  port: parseInt(process.env.MY_SQL_DB_PORT || '3306'),
  username: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQL_ROOT_PASSWORD || '888888',
  database: process.env.MYSQL_DATABASE || 'primitive_system',
  entities: [
    User,
    UserActivity,
    Blog,
    BlogSeries,
    BlogSeriesLink,
    BlogTag,
    Space,
    Member,
    SpacePermission,
    Comment,
    ChatMessage,
    PrivateConversation,
    PrivateMessage,
    UserConversationState,
    LastRead,
    Notification,
    Tag,
    Like,
    Follow,
  ],
  synchronize: process.env.NODE_ENV === 'development', // Never use true in production!
  logging: process.env.NODE_ENV === 'development',
  migrations: [], // We'll add migrations later
  migrationsRun: false, // Set to true if you want to run migrations automatically
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
};
