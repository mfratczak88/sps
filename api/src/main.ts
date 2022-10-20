import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { GlobalExceptionFilter } from './infrastructure/web/exception/exception.filter';

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
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(3000);
}
bootstrap();
