import { IsString, IsNotEmpty } from 'class-validator';
import type {
  CreateCommentReq as ICreateCommentReq,
  CreateCommentRes as ICreateCommentRes,
  CommentWithUser,
} from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentReq implements ICreateCommentReq {
  @ApiProperty({
    example: 'Great post! I really enjoyed reading this.',
    description: 'Comment content',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  content!: string;
}

export class CreateCommentRes implements ICreateCommentRes {
  @ApiProperty({
    description: 'Created comment with user information',
  })
  comment!: CommentWithUser;
}
