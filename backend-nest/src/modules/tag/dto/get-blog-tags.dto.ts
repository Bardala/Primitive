import {
  GetBlogTagsReq as IGetBlogTagsReq,
  GetBlogTagsRes as IGetBlogTagsRes,
  Tag,
} from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class GetBlogTagsReq implements IGetBlogTagsReq {}

export class GetBlogTagsRes implements IGetBlogTagsRes {
  @ApiProperty({
    description: 'List of tags for the blog',
  })
  tags!: Tag[];
}
