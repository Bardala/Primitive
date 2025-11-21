import { IsUUID, IsNotEmpty } from 'class-validator';
import {
  DeleteCommentReq as IDeleteCommentReq,
  DeleteCommentRes as IDeleteCommentRes,
} from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteCommentReq implements IDeleteCommentReq {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Comment ID to delete',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  id!: string;
}

export class DeleteCommentRes implements IDeleteCommentRes {}
