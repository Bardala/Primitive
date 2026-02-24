import type {
  FollowUserReq as IFollowUserReq,
  FollowUserRes as IFollowUserRes,
  StatusMessage,
} from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class FollowUserReq implements IFollowUserReq {}

export class FollowUserRes implements IFollowUserRes {
  @ApiProperty({
    example: 'Successfully followed user',
    description: 'Success message',
  })
  message!: StatusMessage;
}
