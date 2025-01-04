import { Injectable, Logger } from '@nestjs/common';
import { StoveState } from '../../../core/entities/stove-state.entity';
import { StovePublisherPort } from '../../../core/port/driver/stove-publisher.port';
import { sensors, setupSensorConfig } from './homeassistant-configurator';
import { MqttConnectionService } from './mqtt-connection.service';
import { stoveMqttRecordMapper } from './stove-mqtt.dto';

@Injectable()
export class StovePublisherAdapter implements StovePublisherPort {
  private logger = new Logger(StovePublisherAdapter.name);

  constructor(private mqttService: MqttConnectionService) {}

  setupHomeAssistant(stoveId: string): void {
    this.logger.log(`Setting up Home Assistant for stove [${stoveId}]`);

    sensors.forEach((sensor) => {
      const name_camel_case = sensor.name.replace(/ /g, '_').toLowerCase();
      const sensorConfig = setupSensorConfig(
        stoveId,
        sensor.name,
        sensor.valueTemplate,
        sensor.deviceClass,
      );
      const type = sensor.deviceClass === 'heat' ? 'binary_sensor' : 'sensor';
      const topic = `homeassistant/${type}/mcz_${stoveId}/${name_camel_case}/config`;

      this.mqttService.publishMessage(topic, sensorConfig, true);
    });
  }

  connected(stoveId: string, connected: boolean): void {
    this.mqttService.publishStoveMessage(
      `${stoveId}/connected`,
      connected ? 'online' : 'offline',
    );
  }

  publish(stoveId: string, stove: StoveState): void {
    this.logger.debug(`update Stove [${stoveId}] Data`);
    this.mqttService.publishStoveMessage(
      `${stoveId}/stoveData`,
      stoveMqttRecordMapper(stove),
    );
  }
}
