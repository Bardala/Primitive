import { IsString, IsNotEmpty } from 'class-validator';
import {
  RemoveUserTagReq as IRemoveUserTagReq,
  RemoveUserTagRes as IRemoveUserTagRes,
} from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveUserTagReq implements IRemoveUserTagReq {
  @ApiProperty({
    example: 'developer',
    description: 'Tag name to remove from user',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  tagName!: string;
}

export class RemoveUserTagRes implements IRemoveUserTagRes {}
