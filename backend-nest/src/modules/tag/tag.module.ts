import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from 'src/modules/shared/entities/tag.entity';
import { Blog } from 'src/modules/blog/entities/blog.entity';
import { Space } from 'src/modules/space/entities/space.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { TagController } from './controllers/tag.controller';
import { TagService } from './services/tag.service';
import { ValidationModule } from '../shared/validation/validation.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, Blog, Space, User]), ValidationModule],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
