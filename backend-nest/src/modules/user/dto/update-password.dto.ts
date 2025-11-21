import { IsString, IsNotEmpty, MinLength, MaxLength, NotEquals } from 'class-validator';
import { UpdatePasswordReq } from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto implements UpdatePasswordReq {
  @ApiProperty({
    example: 'oldPassword123',
    description: 'Current password',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  oldPassword!: string;

  @ApiProperty({
    example: 'newPassword123',
    description: 'New password (must be different from old password)',
    required: true,
    minLength: 8,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @NotEquals('oldPassword', { message: 'New password must be different from old password' })
  newPassword!: string;
}
