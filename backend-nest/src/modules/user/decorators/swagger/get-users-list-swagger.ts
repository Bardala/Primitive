import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function GetUsersListSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all users list' }),
    ApiResponse({
      status: 200,
      description: 'Returns list of all users',
      schema: {
        example: {
          usersList: [
            { id: '123', username: 'JohnDoe' },
            { id: '456', username: 'jane_smith' },
          ],
        },
      },
    }),
  );
}
