import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';
import type {
  AddMemberReq as IAddMemberReq,
  AddMemberRes as IAddMemberRes,
  SpaceMember,
} from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class AddMemberReq implements IAddMemberReq {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000 or username',
    description: 'User ID or username to add as member',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  member!: string;

  @ApiProperty({
    example: true,
    description: 'Whether the member should be an admin',
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  isAdmin!: boolean;
}

export class AddMemberRes implements IAddMemberRes {
  @ApiProperty({
    description: 'Space member information',
  })
  member!: SpaceMember;
}
