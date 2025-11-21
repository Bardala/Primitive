import { IsString, IsNotEmpty } from 'class-validator';
import { AddBlogTagReq as IAddBlogTagReq, AddBlogTagRes as IAddBlogTagRes } from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class AddBlogTagReq implements IAddBlogTagReq {
  @ApiProperty({
    example: 'javascript',
    description: 'Tag name to add to blog',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  tagName!: string;
}

export class AddBlogTagRes implements IAddBlogTagRes {}
