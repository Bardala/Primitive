import {
  GetSpaceTagsReq as IGetSpaceTagsReq,
  GetSpaceTagsRes as IGetSpaceTagsRes,
  Tag,
} from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class GetSpaceTagsReq implements IGetSpaceTagsReq {}

export class GetSpaceTagsRes implements IGetSpaceTagsRes {
  @ApiProperty({
    description: 'List of tags for the space',
  })
  tags!: Tag[];
}
