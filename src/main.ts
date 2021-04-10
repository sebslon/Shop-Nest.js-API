import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      // disableErrorMessages: true,

      whitelist: true,
      forbidNonWhitelisted: true,

      transform: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
