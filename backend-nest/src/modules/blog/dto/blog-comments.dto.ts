import {
  BlogCommentsReq as IBlogCommentsReq,
  BlogCommentsRes as IBlogCommentsRes,
  CommentWithUser,
} from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class BlogCommentsReq implements IBlogCommentsReq {}

export class BlogCommentsRes implements IBlogCommentsRes {
  @ApiProperty({
    description: 'List of comments with user information',
  })
  comments!: CommentWithUser[];
}
