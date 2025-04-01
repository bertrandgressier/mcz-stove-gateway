import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import configuration from './config/configuration';
import { StoveControlPort } from './core/port/driver/stove-control.port';
import { StovePublisherPort } from './core/port/driver/stove-publisher.port';
import { StoveRepositoryPort } from './core/port/driver/stove-repository.port';
import { GetStovesUseCase } from './core/use-cases/get-stoves.use-case';
import { HomeAssistantUseCase } from './core/use-cases/home-assistant.use-case';
import { StoveConnectionStatusUseCase } from './core/use-cases/stove-connection-status.use-case';
import { TurnOffStoveUseCase } from './core/use-cases/turn-off-stove.use-case';
import { TurnOnStoveUseCase } from './core/use-cases/turn-on-stove.use-case';
import { UpdateStoveStateUseCase } from './core/use-cases/update-stove-state.use-case';
import { MczStoveWebsocket } from './infrastructure/communication/mcz-stove-websocket/mczStoveWebsocket';
import { WebsocketService } from './infrastructure/communication/mcz-stove-websocket/websocket.service';
import { MqttConnectionService } from './infrastructure/communication/mqtt/mqtt-connection.service';
import { MqttService } from './infrastructure/communication/mqtt/mqtt.service';
import { StoveControlAdapter } from './infrastructure/communication/stove-control.adapter';
import { StovePublisherAdapter } from './infrastructure/communication/mqtt/stove-publisher.adapter';
import { StoveRepository } from './infrastructure/persistence/stove.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
  ],
  providers: [
    ConfigService,
    MqttService,
    MczStoveWebsocket,
    WebsocketService,
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
    // New providers for stove control
    {
      provide: StoveControlPort,
      useClass: StoveControlAdapter,
    },
    TurnOnStoveUseCase,
    TurnOffStoveUseCase,
  ],
})
export class StoveAppModule implements OnApplicationBootstrap {
  constructor(private homeAssistant: HomeAssistantUseCase) {}

  onApplicationBootstrap() {
    this.homeAssistant.setupHomeAssistant();
  }
}
