import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StovePublisherPort } from './core/port/driver/stove-publisher.port';
import { StoveRepositoryPort } from './core/port/driver/stove-repository.port';
import { GetStovesUseCase } from './core/use-cases/get-stoves.use-case';
import { StoveConnectionStatusUseCase } from './core/use-cases/stove-connection-status.use-case';
import { UpdateStoveStateUseCase } from './core/use-cases/update-stove-state.use-case';
import { MqttConnectionService } from './infrastructure/communication/mqtt/mqtt-connection.service';
import { MqttService } from './infrastructure/communication/mqtt/mqtt.service';
import { StovePublisherAdapter } from './infrastructure/communication/mqtt/stove-publisher.adapter';
import { MczStoveWebsocket } from './infrastructure/communication/websocket/mczStoveWebsocket';
import { WebsocketService } from './infrastructure/communication/websocket/websocket.service';
import { StoveRepository } from './infrastructure/persistence/stove.repository';

@Module({
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
  ],
})
export class StoveModule {}
