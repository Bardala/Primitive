import {
  ShortLikesListReq as IShortLikesListReq,
  ShortLikesListRes as IShortLikesListRes,
  LikedUser,
} from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class ShortLikesListReq implements IShortLikesListReq {}

export class ShortLikesListRes implements IShortLikesListRes {
  @ApiProperty({
    description: 'List of users who liked the short',
  })
  users!: LikedUser[];
}
