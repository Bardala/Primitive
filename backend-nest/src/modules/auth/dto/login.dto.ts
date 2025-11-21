import { IsString, IsNotEmpty } from 'class-validator';
import { LoginReq } from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto implements LoginReq {
  @ApiProperty({
    example: 'john@example.com',
    description: 'User email or username',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  login!: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password',
    required: true,
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
