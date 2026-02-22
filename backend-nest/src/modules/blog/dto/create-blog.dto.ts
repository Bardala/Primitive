import { IsString, IsNotEmpty, IsUUID, ValidateIf, IsOptional, IsArray } from 'class-validator';
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
    description:
      'Space ID where the blog will be created, if not provided, blog will be created in default space',
    required: false,
  })
  @ValidateIf((o) => o.spaceId !== '1')
  @IsUUID()
  spaceId!: string; // if not provided, blog will be created in default space

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Series ID to associate the blog with',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  seriesId?: string;

  @ApiProperty({
    example: ['typescript', 'nest'],
    description: 'Tags for the blog',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagNames?: string[];
}

export class CreateBlogRes implements ICreateBlogRes {
  @ApiProperty({
    description: 'Created blog object',
  })
  blog!: Blog;
}
