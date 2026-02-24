import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function CreateFollowerSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Follow a user' }),
    ApiParam({ name: 'id', description: 'User ID to follow' }),
    ApiResponse({
      status: 200,
      description: 'Successfully followed user',
      schema: {
        example: {
          message: 'Successfully followed user',
        },
      },
    }),
  );
}
