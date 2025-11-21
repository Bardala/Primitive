import type {
  GetUserCardReq as IGetUserCardReq,
  GetUserCardRes as IGetUserCardRes,
  UserCard,
} from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserCardReq implements IGetUserCardReq {}

export class GetUserCardRes implements IGetUserCardRes {
  @ApiProperty({
    example: {
      id: '123',
      username: 'JohnDoe',
      avatarUrl: 'https://example.com/avatar.jpg',
      bio: 'Software developer',
      isFollowing: true,
      followerCount: 42,
      followingCount: 15,
    },
    description: 'User card information',
  })
  userCard!: UserCard;
}
