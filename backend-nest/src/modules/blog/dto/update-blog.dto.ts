import { IsString, IsNotEmpty, IsUUID, IsOptional, ValidateIf } from 'class-validator';
import { updateBlogReq as IUpdateBlogReq, updateBlogRes as IUpdateBlogRes } from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBlogReq implements IUpdateBlogReq {
  @ApiProperty({
    example: 'Updated Blog Title',
    description: 'Blog title',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    example: 'Updated blog content...',
    description: 'Blog content',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Space ID',
    required: true,
  })
  @IsOptional()
  @ValidateIf((o) => o.spaceId !== '1')
  @IsUUID()
  spaceId!: string;
}

export class UpdateBlogRes implements IUpdateBlogRes {}
