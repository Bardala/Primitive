import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleOptions = {
  secret: process.env.JWT_SECRET || 'fallback_secret_key',
  signOptions: {
    // expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    expiresIn: '24h',
  },
};
