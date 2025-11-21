import {
  ShortCommentsReq as IShortCommentsReq,
  ShortCommentsRes as IShortCommentsRes,
  CommentWithUser,
} from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class ShortCommentsReq implements IShortCommentsReq {}

export class ShortCommentsRes implements IShortCommentsRes {
  @ApiProperty({
    description: 'List of comments with user information',
  })
  comments!: CommentWithUser[];
}
