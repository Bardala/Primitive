import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './logger.middleware';
import { LoggerService } from './common/services/logger.service';

// Modules
import { DatabaseModule } from './modules/shared/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { BlogModule } from './modules/blog/blog.module';
import { SpaceModule } from './modules/space/space.module';
import { ChatModule } from './modules/chat/chat.module';
import { CommentModule } from './modules/comment/comment.module';
import { LikeModule } from './modules/like/like.module';
import { TagModule } from './modules/tag/tag.module';
import { ShortModule } from './modules/short/short.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ValidationModule } from './modules/shared/validation/validation.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: `.env.${process.env.NODE_ENV || 'dev'}`,
    }),

    // Task Scheduling
    ScheduleModule.forRoot(),

    // Database
    DatabaseModule,

    // Feature Modules
    AuthModule,
    UserModule,
    BlogModule,
    SpaceModule,
    ChatModule,
    CommentModule,
    LikeModule,
    TagModule,
    ShortModule,
    NotificationModule,
    ValidationModule,
  ],
  controllers: [AppController],
  providers: [AppService, LoggerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
