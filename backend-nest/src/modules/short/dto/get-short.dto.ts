import type { GetShortReq as IGetShortReq, GetShortRes as IGetShortRes, Short } from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class GetShortReq implements IGetShortReq {}

export class GetShortRes implements IGetShortRes {
  @ApiProperty({
    description: 'Short object',
  })
  short!: Short;
}
