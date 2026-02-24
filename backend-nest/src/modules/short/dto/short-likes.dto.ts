import { ShortLikesReq as IShortLikesReq, ShortLikesRes as IShortLikesRes } from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class ShortLikesReq implements IShortLikesReq {}

export class ShortLikesRes implements IShortLikesRes {
  @ApiProperty({
    example: 10,
    description: 'Number of likes',
  })
  likes!: number;
}
