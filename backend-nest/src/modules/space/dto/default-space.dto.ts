import type {
  DefaultSpaceReq as IDefaultSpaceReq,
  DefaultSpaceRes as IDefaultSpaceRes,
  Space,
} from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class DefaultSpaceReq implements IDefaultSpaceReq {}

export class DefaultSpaceRes implements IDefaultSpaceRes {
  @ApiProperty({
    description: 'Default space object',
  })
  space!: Space;
}
