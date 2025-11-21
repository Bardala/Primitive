import {
  UnReadMsgsNumReq as IUnReadMsgsNumReq,
  UnReadMsgsNumRes as IUnReadMsgsNumRes,
} from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class UnReadMsgsNumReq implements IUnReadMsgsNumReq {}

export class UnReadMsgsNumRes implements IUnReadMsgsNumRes {
  @ApiProperty({
    example: 5,
    description: 'Number of unread messages',
  })
  numOfUnReadMsgs!: number;
}
