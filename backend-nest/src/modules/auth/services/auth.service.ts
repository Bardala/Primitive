import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { LoginRes, SignUpRes } from '@nest/shared';
import { UserService } from 'src/modules/user/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  private validateUsername(username: string): boolean {
    const usernameRegex = /^[A-Za-z][A-Za-z0-9]*$/;
    return usernameRegex.test(username) && username.length >= 3 && username.length <= 20;
  }

  async register(registerDto: RegisterDto): Promise<SignUpRes & { id: string }> {
    // console.table('🚀 ~ AuthService ~ register ~ SignUpRes:', SignUpRes);
    console.log('🚀 ~ AuthService ~ register ~ registerDto:', registerDto);
    const { email, username, password } = registerDto;

    // Validate username format
    if (!this.validateUsername(username)) {
      throw new BadRequestException('Invalid username format');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.userService.create({
      id: randomUUID(),
      email,
      username,
      password: hashedPassword,
      timestamp: Date.now(),
    });

    const payload = { sub: user.id, username: user.username };
    const jwt = this.jwtService.sign(payload);

    return {
      jwt,
      username: user.username,
      id: user.id,
    };
  }

  async login(loginDto: LoginDto): Promise<LoginRes> {
    const { login, password } = loginDto;

    const user = await this.userService.findByLogin(login);
    if (!user) {
      throw new UnauthorizedException('Invalid login credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid login credentials');
    }

    // Update last active
    await this.userService.updateLastActive(user.id);

    const payload = { sub: user.id, username: user.username };
    const jwt = this.jwtService.sign(payload);

    return {
      jwt,
      username: user.username,
      id: user.id,
    };
  }

  async validateUser(payload: any): Promise<any> {
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
