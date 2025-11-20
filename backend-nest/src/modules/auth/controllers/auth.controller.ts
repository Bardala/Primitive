import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { Public } from '../../../common/decorators/public.decorator';
import { LoginRes, SignUpRes } from '@nest/shared';
import { AuthResponseDto } from '../dto/auth-res-dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
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
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed or user already exists',
    schema: {
      example: {
        statusCode: 400,
        message: 'Email already exists',
        error: 'Bad Request',
      },
    },
  })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto): Promise<SignUpRes & { id: string }> {
    return await this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    schema: {
      example: {
        jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        username: 'JohnDoe',
        id: '123e4567-e89b-12d3-a456-426614174000',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid credentials',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid login credentials',
        error: 'Unauthorized',
      },
    },
  })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto): Promise<LoginRes> {
    return await this.authService.login(loginDto);
  }
}
