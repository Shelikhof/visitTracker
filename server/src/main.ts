import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { log } from 'console';
import { CronService } from './cron/cron.service';

async function bootstrap() {
  process.env.TZ = 'Europe/Moscow';
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({ origin: process.env.CLIENT_URL, credentials: true });
  app.use(cookieParser());
  await app.listen(process.env.PORT);
}
bootstrap();
