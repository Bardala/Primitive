import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import type {
  CreateSpaceReq as ICreateSpaceReq,
  CreateSpaceRes as ICreateSpaceRes,
  Space,
  SpaceStatus,
} from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSpaceReq implements ICreateSpaceReq {
  @ApiProperty({
    example: 'Tech Discussions',
    description: 'Space name',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'A space for tech enthusiasts to discuss programming and technology',
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

export class CreateSpaceRes implements ICreateSpaceRes {
  @ApiProperty({
    description: 'Created space object',
  })
  space!: Space;
}
