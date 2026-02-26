import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { LoginRes, SignUpRes } from '@nest/shared';
import { UserService } from 'src/modules/user/services/user.service';
import { IAuthService } from './interfaces';
import { Payload } from 'src/modules/shared/types';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  private validateUsername(username: string) {
    const usernameRegex = /^[A-Za-z][A-Za-z0-9]*$/;
    const valid = usernameRegex.test(username) && username.length >= 3 && username.length <= 20;
    if (!valid) {
      throw new BadRequestException('Invalid username format');
    }
  }

  async register(registerDto: RegisterDto): Promise<SignUpRes & { id: string }> {
    const { email, username, password } = registerDto;

    this.validateUsername(username);

    // Check if username already exists
    const existingUserByUsername = await this.userService.findByUsername(username);
    if (existingUserByUsername) {
      throw new ConflictException('Username already taken');
    }

    // Check if email already exists
    const existingUserByEmail = await this.userService.findByEmail(email);
    if (existingUserByEmail) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.userService.create({
      id: randomUUID(),
      email,
      username,
      password: hashedPassword,
      timestamp: Date.now(),
    });

    const payload: Payload = { sub: user.id, username: user.username };
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

    await this.userService.updateLastActive(user.id);

    const payload: Payload = { sub: user.id, username: user.username };
    const jwt = this.jwtService.sign(payload);

    return {
      jwt,
      username: user.username,
      id: user.id,
    };
  }
}
