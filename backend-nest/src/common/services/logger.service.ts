import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface LogEntry {
  timestamp: string;
  method: string;
  url: string;
  statusCode: number;
  responseTime: number;
  ip: string;
  userAgent?: string;
  userId?: string;
  body?: Record<string, unknown>;
  query?: Record<string, unknown>;
  error?: string;
}

@Injectable()
export class LoggerService {
  private readonly logger = new Logger('HTTP');
  private readonly isDevelopment: boolean;

  constructor(private configService: ConfigService) {
    const env = this.configService.get('NODE_ENV') || 'development';
    this.isDevelopment = env === 'development';
  }

  /**
   * Log HTTP request/response
   */
  logRequest(entry: LogEntry): void {
    const formattedMessage = this.formatLogMessage(entry);
    const logLevel = this.getLogLevel(entry.statusCode);

    switch (logLevel) {
      case 'error':
        this.logger.error(formattedMessage, entry.error);
        break;
      case 'warn':
        this.logger.warn(formattedMessage);
        break;
      default:
        this.logger.log(formattedMessage);
    }

    // Log detailed info in development
    if (this.isDevelopment && (entry.body || entry.query)) {
      this.logDetailedInfo(entry);
    }
  }

  /**
   * Format log message for console output
   */
  private formatLogMessage(entry: LogEntry): string {
    const statusEmoji = this.getStatusEmoji(entry.statusCode);
    const timestamp = this.formatTimestamp(entry.timestamp);
    const duration = `${entry.responseTime}ms`;
    const ip = entry.ip ? `| ${entry.ip}` : '';
    const userId = entry.userId ? `| User: ${entry.userId}` : '';

    return (
      `${statusEmoji} ${entry.method.padEnd(6)} ${entry.url.padEnd(40)} ` +
      `${String(entry.statusCode).padEnd(3)} ${duration.padEnd(8)} ` +
      `${timestamp} ${userId} ${ip}`
    );
  }

  /**
   * Log detailed request/response information
   */
  private logDetailedInfo(entry: LogEntry): void {
    if (entry.query && Object.keys(entry.query).length > 0) {
      this.logger.debug(`Query: ${JSON.stringify(entry.query)}`);
    }

    if (entry.body && Object.keys(entry.body).length > 0) {
      // Don't log sensitive fields
      const sanitizedBody = this.sanitizeBody(entry.body);
      this.logger.debug(`Body: ${JSON.stringify(sanitizedBody)}`);
    }

    if (entry.userAgent) {
      this.logger.debug(`User-Agent: ${entry.userAgent}`);
    }
  }

  /**
   * Get appropriate log level based on status code
   */
  private getLogLevel(statusCode: number): 'error' | 'warn' | 'log' {
    if (statusCode >= 500) return 'error';
    if (statusCode >= 400) return 'warn';
    return 'log';
  }

  /**
   * Get emoji based on status code for visual identification
   */
  private getStatusEmoji(statusCode: number): string {
    if (statusCode >= 500) return '🔴';
    if (statusCode >= 400) return '🟡';
    if (statusCode >= 300) return '🔵';
    if (statusCode >= 200) return '🟢';
    return '⚪';
  }

  /**
   * Format timestamp in HH:mm:ss.MS format
   */
  private formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    });
  }

  /**
   * Sanitize body by removing sensitive fields
   */
  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') return body;

    const sanitizedBody = { ...body };
    const sensitiveFields = ['password', 'token', 'secret', 'authorization', 'apiKey'];

    const sanitizeObject = (obj: any): void => {
      for (const key in obj) {
        if (sensitiveFields.some((field) => key.toLowerCase().includes(field.toLowerCase()))) {
          obj[key] = '***REDACTED***';
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitizeObject(obj[key]);
        }
      }
    };

    sanitizeObject(sanitizedBody);
    return sanitizedBody;
  }

  /**
   * Log application startup info
   */
  logStartup(port: number, environment: string): void {
    this.logger.log(`════════════════════════════════════════════`);
    this.logger.log(`🚀 Application started successfully!`);
    this.logger.log(`📍 Server running on port: ${port}`);
    this.logger.log(`🔧 Environment: ${environment}`);
    this.logger.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    this.logger.log(`════════════════════════════════════════════`);
  }

  /**
   * Log application shutdown info
   */
  logShutdown(): void {
    this.logger.log(`════════════════════════════════════════════`);
    this.logger.log(`🛑 Application shutdown`);
    this.logger.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    this.logger.log(`════════════════════════════════════════════`);
  }
}
