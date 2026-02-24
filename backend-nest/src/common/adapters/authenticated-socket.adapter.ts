import { IoAdapter } from '@nestjs/platform-socket.io';
import { JwtService } from '@nestjs/jwt';
import { INestApplication, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';

export interface SocketUserData {
  sub: string;
  username: string;
  id?: string;
  email?: string;
  iat?: number;
  exp?: number;
}

export class AuthenticatedSocketAdapter extends IoAdapter {
  private readonly logger = new Logger(AuthenticatedSocketAdapter.name);

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    app: INestApplication,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: any): any {
    const allowedOrigins = this.configService.get<string>('ALLOWED_ORIGINS');
    let origin: string | string[];

    if (allowedOrigins) {
      origin = allowedOrigins.split(',').map((url) => url.trim());
    } else {
      origin = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
    }

    const corsOptions = {
      origin,
      methods: ['GET', 'POST'],
      credentials: true,
    };

    const server = super.createIOServer(port, {
      ...options,
      cors: corsOptions,
    });

    // Attach authentication middleware
    server.use(this.authenticate.bind(this));
    return server;
  }

  /**
   * Authenticate socket connection using JWT token from handshake
   * Token can be provided via:
   * - Authorization header: "Bearer <token>"
   * - auth.token in handshake
   * - query.token in URL
   */
  private authenticate(socket: Socket, next: (err?: Error) => void): void {
    try {
      let token: string | null = null;

      // Try to get token from various sources
      const authHeader = socket.handshake.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.slice(7);
      }

      // Fallback to auth object
      if (!token && socket.handshake.auth?.token) {
        token = socket.handshake.auth.token;
      }

      // Fallback to query parameters
      if (!token && socket.handshake.query?.token) {
        token = socket.handshake.query.token as string;
      }

      // Fallback to cookies
      if (!token && socket.handshake.headers.cookie) {
        const cookies = socket.handshake.headers.cookie.split(';');
        const jwtCookie = cookies.find((c) => c.trim().startsWith('jwt='));
        if (jwtCookie) {
          token = jwtCookie.split('=')[1].trim();
        }
      }

      if (!token) {
        this.logger.warn(`Connection rejected: No token provided [${socket.id}]`);
        return next(new Error('Unauthorized: No token provided'));
      }

      const decoded = this.jwtService.verify<SocketUserData>(token);
      socket.data.user = decoded;

      next();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Authentication failed [${socket.id}]: ${message}`);
      next(new Error(`Unauthorized: ${message}`));
    }
  }
}
