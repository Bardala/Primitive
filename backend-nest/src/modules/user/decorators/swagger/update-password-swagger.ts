import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function UpdatePasswordSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Update user password' }),
    ApiResponse({
      status: 200,
      description: 'Password updated successfully',
      schema: {
        example: {
          message: 'Password updated successfully',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - validation failed',
    }),
  );
}
