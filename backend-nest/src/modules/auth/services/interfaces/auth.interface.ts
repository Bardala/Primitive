import { LoginDto } from '../../dto/login.dto';
import { RegisterDto } from '../../dto/register.dto';
import { LoginRes, SignUpRes } from '@nest/shared';

/**
 * IAuthService interface
 * Responsibility: Handle authentication operations (login, registration, token management)
 */
export interface IAuthService {
  register(registerDto: RegisterDto): Promise<SignUpRes & { id: string }>;
  login(loginDto: LoginDto): Promise<LoginRes>;
}
