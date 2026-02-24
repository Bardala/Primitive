import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

export function GetUserBlogsSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Get user blogs with pagination' }),
    ApiParam({ name: 'id', description: 'User ID' }),
    ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 }),
    ApiResponse({
      status: 200,
      description: 'Returns user blogs with pagination',
      schema: {
        example: {
          blogs: [
            {
              id: 'blog123',
              title: 'My First Blog',
              content: 'Blog content...',
              author: 'JohnDoe',
              timestamp: 1633046400000,
            },
          ],
          page: 1,
        },
      },
    }),
  );
}
