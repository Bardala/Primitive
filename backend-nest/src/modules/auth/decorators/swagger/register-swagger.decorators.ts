import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthResponseDto } from '../../dto/auth-res-dto';
import { RegisterDto } from '../../dto/register.dto';

export function RegisterSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Register a new user' }),

    ApiResponse({
      status: 201,
      description: 'User successfully registered',
      type: AuthResponseDto,
      schema: {
        example: {
          jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          username: 'JohnDoe',
          id: '123e4567-e89b-12d3-a456-426614174000',
        },
      },
    }),

    ApiResponse({
      status: 400,
      description: 'Bad request - validation failed or user already exists',
      schema: {
        example: {
          statusCode: 400,
          message: 'Email already exists',
          error: 'Bad Request',
        },
      },
    }),

    ApiBody({ type: RegisterDto }),
  );
}
