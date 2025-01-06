import { LogLevel } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import configuration from './config/configuration';
import { StoveAppModule } from './stove-app.module';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(
    ConfigModule.forRoot({
      load: [configuration],
    }),
  );
  const config = appContext.get(ConfigService);
  const activatedDebugLog = config.get<boolean>('app.setup.debug');

  const loggerLevel: LogLevel[] = activatedDebugLog
    ? ['log', 'error', 'warn', 'debug', 'verbose']
    : ['log', 'error', 'warn'];

  await NestFactory.createApplicationContext(StoveAppModule, {
    logger: loggerLevel,
  });
}

bootstrap();
