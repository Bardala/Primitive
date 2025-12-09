import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function GetUserSpacesSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Get user spaces' }),
    ApiParam({ name: 'id', description: 'User ID' }),
    ApiResponse({
      status: 200,
      description: 'Returns user spaces',
      schema: {
        example: {
          spaces: [
            {
              id: 'space123',
              name: 'Tech Discussions',
              description: 'Space for tech enthusiasts',
              status: 'active',
            },
          ],
        },
      },
    }),
  );
}
