import type {
  UnFollowUserReq as IUnFollowUserReq,
  UnFollowUserRes as IUnFollowUserRes,
  StatusMessage,
} from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class UnFollowUserReq implements IUnFollowUserReq {}

export class UnFollowUserRes implements IUnFollowUserRes {
  @ApiProperty({
    example: 'Successfully unfollowed user',
    description: 'Success message',
  })
  message!: StatusMessage;
}
