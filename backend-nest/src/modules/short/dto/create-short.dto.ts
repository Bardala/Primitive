import { IsString, IsNotEmpty } from 'class-validator';
import type {
  CreateShortReq as ICreateShortReq,
  CreateShortRes as ICreateShortRes,
  Short,
} from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShortReq implements ICreateShortReq {
  @ApiProperty({
    example: 'Quick React Tip',
    description: 'Short form title',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    example: 'Use useCallback to optimize performance...',
    description: 'Short form content',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  content!: string;
}

export class CreateShortRes implements ICreateShortRes {
  @ApiProperty({
    description: 'Created short object',
  })
  short!: Short;
}
