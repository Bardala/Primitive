import {
  AllUnReadMsgsReq as IAllUnReadMsgsReq,
  AllUnReadMsgsRes as IAllUnReadMsgsRes,
  UnReadMsgs,
} from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class AllUnReadMsgsReq implements IAllUnReadMsgsReq {}

export class AllUnReadMsgsRes implements IAllUnReadMsgsRes {
  @ApiProperty({
    description: 'Array of unread messages',
  })
  numberOfMsgs!: UnReadMsgs[];
}
