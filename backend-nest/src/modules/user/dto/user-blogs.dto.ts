import { UserBlogsReq as IUserBlogsReq, UserBlogsRes as IUserBlogsRes, Blog } from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class UserBlogsReq implements IUserBlogsReq {}

export class UserBlogsRes implements IUserBlogsRes {
  @ApiProperty({
    example: [
      {
        id: 'blog123',
        title: 'My First Blog',
        content: 'Blog content...',
        author: 'JohnDoe',
        timestamp: 1633046400000,
      },
    ],
    description: 'User blogs',
  })
  blogs!: Blog[];

  @ApiProperty({
    example: 1,
    description: 'Current page number',
  })
  page!: number;
}
