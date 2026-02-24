import type {
  JoinSpaceReq as IJoinSpaceReq,
  JoinSpaceRes as IJoinSpaceRes,
  SpaceMember,
} from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class JoinSpaceReq implements IJoinSpaceReq {}

export class JoinSpaceRes implements IJoinSpaceRes {
  @ApiProperty({
    description: 'Space member information',
  })
  member!: SpaceMember;
}
