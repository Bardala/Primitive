import type {
  RemoveLikeReq as IRemoveLikeReq,
  RemoveLikeRes as IRemoveLikeRes,
  StatusMessage,
} from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveLikeReq implements IRemoveLikeReq {}

export class RemoveLikeRes implements IRemoveLikeRes {
  @ApiProperty({
    example: 'Successfully removed like',
    description: 'Success message',
  })
  message!: StatusMessage;
}
