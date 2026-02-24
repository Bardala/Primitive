import { IsString, IsNotEmpty } from 'class-validator';
import { AddSpaceTagReq as IAddSpaceTagReq, AddSpaceTagRes as IAddSpaceTagRes } from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class AddSpaceTagReq implements IAddSpaceTagReq {
  @ApiProperty({
    example: 'technology',
    description: 'Tag name to add to space',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  tagName!: string;
}

export class AddSpaceTagRes implements IAddSpaceTagRes {}
