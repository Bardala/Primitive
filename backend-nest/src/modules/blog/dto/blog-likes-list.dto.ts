import {
  BlogLikesListReq as IBlogLikesListReq,
  BlogLikesListRes as IBlogLikesListRes,
  LikedUser,
} from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class BlogLikesListReq implements IBlogLikesListReq {}

export class BlogLikesListRes implements IBlogLikesListRes {
  @ApiProperty({
    description: 'List of users who liked the blog',
  })
  users!: LikedUser[];
}
