import { LogLevel } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import configuration from './config/configuration';
import { StoveAppApiModule } from './stove-app-api.module';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(
    ConfigModule.forRoot({
      load: [configuration],
    }),
  );
  const configContext = appContext.get(ConfigService);
  const activatedDebugLog = configContext.get<boolean>('app.setup.debug');

  const loggerLevel: LogLevel[] = activatedDebugLog
    ? ['log', 'error', 'warn', 'debug', 'verbose']
    : ['log', 'error', 'warn'];

  const app = await NestFactory.create(StoveAppApiModule, {
    logger: loggerLevel,
  });

  const configSwagger = new DocumentBuilder()
    .setTitle('Stove API')
    .setDescription('Stove Simulator API ')
    .setVersion('1.0')
    .addTag('stove')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(3000);
}

bootstrap();
