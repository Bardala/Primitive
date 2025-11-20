import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';
import { SignUpReq } from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto implements SignUpReq {
  @ApiProperty({
    example: 'john@example.com',
    description: 'User email address',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'JohnDoe',
    description: 'Username must start with a letter and contain only letters and numbers',
    required: true,
    minLength: 3,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[A-Za-z][A-Za-z0-9]*$/, {
    message: 'Username must start with a letter and contain only letters and numbers',
  })
  username: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password',
    required: true,
    minLength: 8,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}
