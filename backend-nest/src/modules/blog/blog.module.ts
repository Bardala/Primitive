import { Module } from '@nestjs/common';
import { BlogController } from './controllers/blog.controller';
import { BlogService } from './services/blog.service';
import { BlogTagService } from './services/blog-tag.service';
import { BlogSeriesService } from './services/blog-series.service';

@Module({
  controllers: [BlogController],
  providers: [BlogService, BlogTagService, BlogSeriesService],
})
export class BlogModule {}
