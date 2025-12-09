import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function GetFollowersSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Get user followers' }),
    ApiParam({ name: 'id', description: 'User ID' }),
    ApiResponse({
      status: 200,
      description: 'Returns list of followers',
      schema: {
        example: {
          followers: [
            { id: '456', username: 'follower1' },
            { id: '789', username: 'follower2' },
          ],
        },
      },
    }),
  );
}
