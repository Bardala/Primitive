import { BlogLikesReq as IBlogLikesReq, BlogLikesRes as IBlogLikesRes } from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class BlogLikesReq implements IBlogLikesReq {}

export class BlogLikesRes implements IBlogLikesRes {
  @ApiProperty({
    example: 42,
    description: 'Number of likes',
  })
  likes!: number;

  @ApiProperty({
    example: true,
    description: 'Whether the current user has liked this blog',
  })
  isLiked!: boolean;
}
