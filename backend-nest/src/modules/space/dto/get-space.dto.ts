import type { SpaceReq as ISpaceReq, SpaceRes as ISpaceRes, Space } from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class SpaceReq implements ISpaceReq {}

export class SpaceRes implements ISpaceRes {
  @ApiProperty({
    description: 'Space object',
  })
  space!: Space;
}
