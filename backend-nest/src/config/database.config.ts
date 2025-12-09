import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { BlogSeriesLink } from 'src/modules/blog/entities/blog-series-links.entity';
import { BlogSeries } from 'src/modules/blog/entities/blog-series.entity';
import { BlogTag } from 'src/modules/blog/entities/blog-tag.entity';
import { Blog } from 'src/modules/blog/entities/blog.entity';
import { ChatMessage } from 'src/modules/chat/entities/chat-message.entity';
import { LastRead } from 'src/modules/chat/entities/last-read.entity';
import { PrivateConversation } from 'src/modules/chat/entities/private-conversation.entity';
import { PrivateMessage } from 'src/modules/chat/entities/private-message.entity';
import { UserConversationState } from 'src/modules/chat/entities/user-conversation-state.entity';
import { Follow } from 'src/modules/shared/entities/follow.entity';
import { Tag } from 'src/modules/shared/entities/tag.entity';
import { Member } from 'src/modules/space/entities/member.entity';
import { SpacePermission } from 'src/modules/space/entities/space-permission.entity';
import { Space } from 'src/modules/space/entities/space.entity';
import { Comment } from 'src/modules/comment/entities/comment.entity';
import { Notification } from 'src/modules/notification/entities/notification.entity';
import { UserActivity } from 'src/modules/user/entities/user-activity.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Like } from 'src/modules/shared/entities/like.entity';

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
