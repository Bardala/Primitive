import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

import { BlogSeriesLink } from '../modules/blog/entities/blog-series-links.entity';
import { BlogSeries } from '../modules/blog/entities/blog-series.entity';
import { BlogTag } from '../modules/blog/entities/blog-tag.entity';
import { Blog } from '../modules/blog/entities/blog.entity';
import { ChatMessage } from '../modules/chat/entities/chat-message.entity';
import { LastRead } from '../modules/chat/entities/last-read.entity';
import { PrivateConversation } from '../modules/chat/entities/private-conversation.entity';
import { PrivateMessage } from '../modules/chat/entities/private-message.entity';
import { UserConversationState } from '../modules/chat/entities/user-conversation-state.entity';
import { Follow } from '../modules/shared/entities/follow.entity';
import { Tag } from '../modules/shared/entities/tag.entity';
import { Member } from '../modules/space/entities/member.entity';
import { SpacePermission } from '../modules/space/entities/space-permission.entity';
import { Space } from '../modules/space/entities/space.entity';
import { Comment } from '../modules/comment/entities/comment.entity';
import { Notification } from '../modules/notification/entities/notification.entity';
import { UserActivity } from '../modules/user/entities/user-activity.entity';
import { User } from '../modules/user/entities/user.entity';
import { Like } from '../modules/shared/entities/like.entity';

dotenv.config();

export const entities = [
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
];

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQLHOST,
  port: parseInt(process.env.MYSQLPORT || '3306'),
  username: process.env.MYSQLUSER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: entities,
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
});
