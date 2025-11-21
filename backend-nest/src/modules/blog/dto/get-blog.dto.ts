import type { BlogReq as IBlogReq, BlogRes as IBlogRes, Blog } from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class BlogReq implements IBlogReq {}

export class BlogRes implements IBlogRes {
  @ApiProperty({
    description: 'Blog object',
  })
  blog!: Blog;
}
