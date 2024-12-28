import { Injectable, Logger } from '@nestjs/common';
import { StoveState } from '../../../core/entities/stove-state.entity';
import { StovePublisherPort } from '../../../core/port/driver/stove-publisher.port';
import { MqttConnectionService } from './mqtt-connection.service';
import { stoveMqttRecordMapper } from './stove-mqtt.dto';

@Injectable()
export class StovePublisherAdapter implements StovePublisherPort {
  private logger = new Logger(StovePublisherAdapter.name);

  constructor(private mqttService: MqttConnectionService) {}

  connected(stoveId: string, connected: boolean): void {
    this.mqttService.publishStoveMessage(`${stoveId}/connected`, connected);
  }

  publish(stoveId: string, stove: StoveState): void {
    this.logger.debug(`update Stove [${stoveId}] Data`);
    this.mqttService.publishStoveMessage(
      `${stoveId}/stoveData`,
      stoveMqttRecordMapper(stove),
    );
  }
}
