import {
  GetUserTagsReq as IGetUserTagsReq,
  GetUserTagsRes as IGetUserTagsRes,
  Tag,
} from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserTagsReq implements IGetUserTagsReq {}

export class GetUserTagsRes implements IGetUserTagsRes {
  @ApiProperty({
    description: 'List of tags for the user',
  })
  tags!: Tag[];
}
