import { Controller, Post, Body, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as express from 'express';
import { ENDPOINT, LoginRes, SignUpRes } from '@nest/shared';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { LoginSwagger, RegisterSwagger } from '../decorators/swagger';
import { PublicEndpoint } from 'src/common/decorators';
import { AuthService } from '../services';

@ApiTags('Authentication')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post(ENDPOINT.SIGNUP)
  @PublicEndpoint()
  @RegisterSwagger()
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: express.Response,
  ): Promise<SignUpRes & { id: string }> {
    const result = await this.authService.register(registerDto);
    this.setCookie(response, result.jwt);
    return result;
  }

  @Post(ENDPOINT.LOGIN)
  @PublicEndpoint()
  @HttpCode(HttpStatus.OK)
  @LoginSwagger()
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: express.Response,
  ): Promise<LoginRes> {
    const result = await this.authService.login(loginDto);
    this.setCookie(response, result.jwt);
    return result;
  }

  @Post(ENDPOINT.LOGOUT)
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: express.Response) {
    response.clearCookie('jwt');
    return { message: 'Logged out successfully' };
  }

  private setCookie(response: express.Response, token: string) {
  const isProduction = process.env.NODE_ENV === 'production';
  
  response.cookie('jwt', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}
}
