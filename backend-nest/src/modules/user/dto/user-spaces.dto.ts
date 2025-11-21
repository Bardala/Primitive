import {
  UserSpacesReq as IUserSpacesReq,
  UserSpacesRes as IUserSpacesRes,
  Space,
} from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class UserSpacesReq implements IUserSpacesReq {}

export class UserSpacesRes implements IUserSpacesRes {
  @ApiProperty({
    example: [
      {
        id: 'space123',
        name: 'Tech Discussions',
        description: 'Space for tech enthusiasts',
        status: 'active',
      },
    ],
    description: 'User spaces',
  })
  spaces!: Space[];
}
