import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import type {
  UpdateShortReq as IUpdateShortReq,
  UpdateShortRes as IUpdateShortRes,
  Short,
} from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateShortReq implements IUpdateShortReq {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Short ID',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  readonly id!: string;

  @ApiProperty({
    example: 'Updated Short Title',
    description: 'Short form title',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    example: 'Updated short content...',
    description: 'Short form content',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  content!: string;
}

export class UpdateShortRes implements IUpdateShortRes {
  @ApiProperty({
    description: 'Updated short object',
  })
  short!: Short;
}
