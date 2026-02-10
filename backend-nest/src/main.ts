import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggerService } from './common/services/logger.service';
import { AuthenticatedSocketAdapter } from './common/adapters/authenticated-socket.adapter';
import { JwtService } from '@nestjs/jwt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const jwtService = app.get(JwtService);
  const loggerService = app.get(LoggerService);

  // app.useWebSocketAdapter(new AuthenticatedSocketAdapter(jwtService, configService));
  const adapter = new AuthenticatedSocketAdapter(jwtService, configService, app);
  app.useWebSocketAdapter(adapter);

  // Global pipes for validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global filters
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global interceptors
  app.useGlobalInterceptors(new TransformInterceptor());

  // CORS
  app.enableCors({
    origin: (configService.get('ORIGIN') as string) || 'http://localhost:3000',
    credentials: true,
  });

  app.setGlobalPrefix('/api/v0');

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Primitive API')
    .setDescription('The Primitive API documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const port = Number(configService.get('PORT'));
  const environment = configService.get('NODE_ENV') as string;

  await app.listen(port);

  loggerService.logStartup(port, environment);

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    loggerService.logShutdown();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    loggerService.logShutdown();
    process.exit(0);
  });
}

void bootstrap();
