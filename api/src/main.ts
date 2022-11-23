import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { GlobalExceptionFilter } from './infrastructure/web/exception/exception.filter';
import { ValidationPipe } from '@nestjs/common';

const corsSetup = () => {
  if (process.env.CORS_ENABLED) {
    return {
      cors: {
        origin: ['localhost:4200', 'http://localhost:4200'],
        credentials: true,
      },
    };
  }
};
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    ...corsSetup(),
  });
  app.use(cookieParser());
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapter));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(3000);
}
bootstrap();
