import { MembersReq as IMembersReq, MembersRes as IMembersRes, SpaceMember } from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class MembersReq implements IMembersReq {}

export class MembersRes implements IMembersRes {
  @ApiProperty({
    description: 'List of space members',
  })
  members!: SpaceMember[];
}
