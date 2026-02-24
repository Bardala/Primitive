import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function DeleteFollowerSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Unfollow a user' }),
    ApiParam({ name: 'id', description: 'User ID to unfollow' }),
    ApiResponse({
      status: 200,
      description: 'Successfully unfollowed user',
      schema: {
        example: {
          message: 'Successfully unfollowed user',
        },
      },
    }),
  );
}
