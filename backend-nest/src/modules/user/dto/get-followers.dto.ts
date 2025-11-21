import {
  GetFollowersReq as IGetFollowersReq,
  GetFollowersRes as IGetFollowersRes,
  User,
} from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class GetFollowersReq implements IGetFollowersReq {}

export class GetFollowersRes implements IGetFollowersRes {
  @ApiProperty({
    example: [
      { id: '456', username: 'follower1' },
      { id: '789', username: 'follower2' },
    ],
    description: 'List of followers',
  })
  followers!: Pick<User, 'id' | 'username'>[];
}
