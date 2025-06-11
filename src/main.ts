import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ToLowerCasePipe } from './common/pipes/to.lower.case.pipe';
import { TimingConnectionInterceptor } from './common/interceptors/timing-connection.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
    new ToLowerCasePipe(),
  );
  app.useGlobalInterceptors(new TimingConnectionInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
