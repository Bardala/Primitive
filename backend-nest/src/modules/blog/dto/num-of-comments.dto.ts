import {
  NumOfCommentsReq as INumOfCommentsReq,
  NumOfCommentsRes as INumOfCommentsRes,
} from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class NumOfCommentsReq implements INumOfCommentsReq {}

export class NumOfCommentsRes implements INumOfCommentsRes {
  @ApiProperty({
    example: 5,
    description: 'Number of comments',
  })
  numOfComments!: number;
}
