import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ToLowerCasePipe } from './common/pipes/to.lower.case.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
    new ToLowerCasePipe(),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
