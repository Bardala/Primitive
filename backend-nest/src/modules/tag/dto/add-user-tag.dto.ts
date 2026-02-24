import { IsString, IsNotEmpty } from 'class-validator';
import { AddUserTagReq as IAddUserTagReq, AddUserTagRes as IAddUserTagRes } from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class AddUserTagReq implements IAddUserTagReq {
  @ApiProperty({
    example: 'developer',
    description: 'Tag name to add to user',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  tagName!: string;
}

export class AddUserTagRes implements IAddUserTagRes {}
