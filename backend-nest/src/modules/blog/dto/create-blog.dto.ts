import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import type {
  CreateBlogReq as ICreateBlogReq,
  CreateBlogRes as ICreateBlogRes,
  Blog,
} from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogReq implements ICreateBlogReq {
  @ApiProperty({
    example: 'My First Blog',
    description: 'Blog title',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    example: 'This is the content of my blog post...',
    description: 'Blog content',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Space ID where the blog will be created',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  spaceId!: string;
}

export class CreateBlogRes implements ICreateBlogRes {
  @ApiProperty({
    description: 'Created blog object',
  })
  blog!: Blog;
}
