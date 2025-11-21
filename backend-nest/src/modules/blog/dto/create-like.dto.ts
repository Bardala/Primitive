import type {
  CreateLikeReq as ICreateLikeReq,
  CreateLikeRes as ICreateLikeRes,
  StatusMessage,
} from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLikeReq implements ICreateLikeReq {}

export class CreateLikeRes implements ICreateLikeRes {
  @ApiProperty({
    example: 'Successfully liked',
    description: 'Success message',
  })
  message!: StatusMessage;
}
