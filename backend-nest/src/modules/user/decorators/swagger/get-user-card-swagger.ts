import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function GetUserCardSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Get user card information' }),
    ApiParam({ name: 'id', description: 'User ID' }),
    ApiResponse({
      status: 200,
      description: 'Returns user card data',
      schema: {
        example: {
          userCard: {
            id: '123',
            username: 'JohnDoe',
            avatarUrl: 'https://example.com/avatar.jpg',
            bio: 'Software developer',
            isFollowing: true,
            followerCount: 42,
            followingCount: 15,
          },
        },
      },
    }),
  );
}
