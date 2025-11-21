import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import {
  UpdateCommentReq as IUpdateCommentReq,
  UpdateCommentRes as IUpdateCommentRes,
} from '@nest/shared';

export class UpdateCommentReq implements IUpdateCommentReq {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Comment ID',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({
    example: 'Updated comment content',
    description: 'Updated comment content',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  content!: string;
}

export class UpdateCommentRes implements IUpdateCommentRes {}
