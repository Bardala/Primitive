import { IsString, IsNotEmpty } from 'class-validator';
import type {
  CreateTagReq as ICreateTagReq,
  CreateTagRes as ICreateTagRes,
  Tag,
} from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTagReq implements ICreateTagReq {
  @ApiProperty({
    example: 'typescript',
    description: 'Tag name to create',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  tagName!: string;
}

export class CreateTagRes implements ICreateTagRes {
  @ApiProperty({
    description: 'Created tag object',
  })
  tag!: Tag;
}
