import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from '../../dto/login.dto';

export function LoginSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'User login' }),

    ApiResponse({
      status: 200,
      description: 'User successfully logged in',
      schema: {
        example: {
          jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          username: 'JohnDoe',
          id: '123e4567-e89b-12d3-a456-426614174000',
        },
      },
    }),

    ApiResponse({
      status: 401,
      description: 'Unauthorized - invalid credentials',
      schema: {
        example: {
          statusCode: 401,
          message: 'Invalid login credentials',
          error: 'Unauthorized',
        },
      },
    }),

    ApiBody({ type: LoginDto }),
  );
}
