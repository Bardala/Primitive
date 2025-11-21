import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import type {
  UpdateSpaceReq as IUpdateSpaceReq,
  UpdateSpaceRes as IUpdateSpaceRes,
  SpaceStatus,
  Space,
} from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSpaceReq implements IUpdateSpaceReq {
  @ApiProperty({
    example: 'Updated Space Name',
    description: 'Space name',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'Updated space description',
    description: 'Space description',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({
    example: 'public',
    description: 'Space visibility status',
    required: true,
    enum: ['public', 'private'],
  })
  @IsEnum(['public', 'private'])
  @IsNotEmpty()
  status!: SpaceStatus;
}

export class UpdateSpaceRes implements IUpdateSpaceRes {
  @ApiProperty({
    description: 'Updated space object',
  })
  space!: Space;
}
