import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { StovePublisherPort } from './core/port/driver/stove-publisher.port';
import { StoveRepositoryPort } from './core/port/driver/stove-repository.port';
import { GetStovesUseCase } from './core/use-cases/get-stoves.use-case';
import { HomeAssistantUseCase } from './core/use-cases/home-assistant.use-case';
import { StoveConnectionStatusUseCase } from './core/use-cases/stove-connection-status.use-case';
import { UpdateStoveStateUseCase } from './core/use-cases/update-stove-state.use-case';
import { MqttConnectionService } from './infrastructure/communication/mqtt/mqtt-connection.service';
import { MqttService } from './infrastructure/communication/mqtt/mqtt.service';
import { StovePublisherAdapter } from './infrastructure/communication/mqtt/stove-publisher.adapter';
import { StoveApiController } from './infrastructure/communication/stove-api/stove-api.controller';
import { StoveApiService } from './infrastructure/communication/stove-api/stove-api.service';
import { StoveRepository } from './infrastructure/persistence/stove.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
  ],
  providers: [
    ConfigService,
    MqttService,
    StoveApiService,
    MqttConnectionService,
    {
      provide: StovePublisherPort,
      useClass: StovePublisherAdapter,
    },

    {
      provide: StoveRepositoryPort,
      useClass: StoveRepository,
    },
    GetStovesUseCase,
    StoveConnectionStatusUseCase,
    UpdateStoveStateUseCase,
    HomeAssistantUseCase,
  ],
  controllers: [StoveApiController],
})
export class StoveAppApiModule implements OnApplicationBootstrap {
  constructor(private homeAssistant: HomeAssistantUseCase) {}

  onApplicationBootstrap() {
    this.homeAssistant.setupHomeAssistant();
  }
}
