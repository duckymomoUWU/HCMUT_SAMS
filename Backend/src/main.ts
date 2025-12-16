import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Enable validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          message: error.constraints ? Object.values(error.constraints).join(', ') : `Validation failed for nested object: ${error.property}`,
        }));
        console.log('Validation Errors:', errors); // <--- Add this line
        return new BadRequestException(result);
      },
    }),
  );

  // Enable Global Guards (Authentication & Authorization)
  const reflector = app.get(Reflector);
  app.useGlobalGuards(
    new JwtAuthGuard(reflector), // 1. Kiểm tra JWT token trước
    new RolesGuard(reflector), // 2. Kiểm tra role sau
  );

  await app.listen(process.env.PORT ?? 5000, '0.0.0.0');
  console.log(
    `Application is running on: http://localhost:${process.env.PORT ?? 5000}`,
  );
}
void bootstrap();
