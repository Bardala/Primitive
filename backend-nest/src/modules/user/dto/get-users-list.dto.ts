import {
  GetUsersListReq as IGetUsersListReq,
  GetUsersListRes as IGetUsersListRes,
  UsersList,
} from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class GetUsersListReq implements IGetUsersListReq {}

export class GetUsersListRes implements IGetUsersListRes {
  @ApiProperty({
    example: [
      { id: '123', username: 'JohnDoe' },
      { id: '456', username: 'jane_smith' },
    ],
    description: 'List of users',
  })
  usersList!: UsersList[];
}
