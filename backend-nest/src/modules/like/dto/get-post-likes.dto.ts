import {
  GetPostLikesReq as IGetPostLikesReq,
  GetPostLikesRes as IGetPostLikesRes,
  LikedUser,
} from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class GetPostLikesReq implements IGetPostLikesReq {}

export class GetPostLikesRes implements IGetPostLikesRes {
  @ApiProperty({
    description: 'List of users who liked the post',
  })
  users!: LikedUser[];
}
