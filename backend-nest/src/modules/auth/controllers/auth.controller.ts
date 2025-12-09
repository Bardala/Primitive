import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
  async register(@Body() registerDto: RegisterDto): Promise<SignUpRes & { id: string }> {
    return await this.authService.register(registerDto);
  }

  @Post(ENDPOINT.LOGIN)
  @PublicEndpoint()
  @HttpCode(HttpStatus.OK)
  @LoginSwagger()
  async login(@Body() loginDto: LoginDto): Promise<LoginRes> {
    return await this.authService.login(loginDto);
  }
}
