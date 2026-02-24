import {
  SpaceBlogsReq as ISpaceBlogsReq,
  SpaceBlogsRes as ISpaceBlogsRes,
  Blog,
} from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class SpaceBlogsReq implements ISpaceBlogsReq {}

export class SpaceBlogsRes implements ISpaceBlogsRes {
  @ApiProperty({
    description: 'List of blogs in the space',
  })
  blogs!: Blog[];

  @ApiProperty({
    example: 1,
    description: 'Current page number',
  })
  page!: number;
}
