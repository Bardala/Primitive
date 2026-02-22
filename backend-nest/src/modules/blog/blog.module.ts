import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from 'src/modules/shared/entities/like.entity';
import { Tag } from 'src/modules/shared/entities/tag.entity';
import { Comment } from '../comment/entities/comment.entity';
import { ValidationModule } from '../shared/validation/validation.module';
import { Member } from '../space/entities/member.entity';
import { Space } from '../space/entities/space.entity';
import { User } from '../user/entities/user.entity';
import { BlogController } from './controllers/blog.controller';
import { Blog } from './entities/blog.entity';
import { BlogRepository } from './repositories/blog.repository';
import { BlogSeriesService } from './services/blog-series.service';
import { BlogTagService } from './services/blog-tag.service';
import { BlogService } from './services/blog.service';
import { FeedsService } from './services/feeds.service';
import { FeedsController } from './controllers/feeds.controller';

import { BlogSeriesController } from './controllers/blog-series.controller';
import { BlogSeriesLink } from './entities/blog-series-links.entity';
import { BlogSeries } from './entities/blog-series.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Blog,
      Like,
      Comment,
      Space,
      User,
      Member,
      BlogSeries,
      BlogSeriesLink,
      Tag,
    ]),
    ValidationModule,
  ],
  controllers: [BlogController, FeedsController, BlogSeriesController],
  providers: [BlogService, BlogRepository, BlogTagService, BlogSeriesService, FeedsService],
  exports: [BlogService],
})
export class BlogModule {}
