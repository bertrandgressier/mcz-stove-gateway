import { Injectable, Logger } from '@nestjs/common';
import { StoveState } from '../../../core/entities/stove-state.entity';
import { StovePublisherPort } from '../../../core/port/driver/stove-publisher.port';
import {
  binarySensors,
  sensors,
  setupBinarySensorConfig,
  setupClimateConfig,
  setupSensorConfig,
} from './homeassistant-configurator';
import { MqttConnectionService } from './mqtt-connection.service';
import { stoveMqttRecordMapper } from './stove-mqtt.dto';

@Injectable()
export class StovePublisherAdapter implements StovePublisherPort {
  private logger = new Logger(StovePublisherAdapter.name);

  constructor(private mqttService: MqttConnectionService) {}

  setupHomeAssistant(stoveId: string): void {
    this.logger.log(`Setting up Home Assistant for stove [${stoveId}]`);

    //publish sensors config
    sensors.forEach((sensor) => {
      const name_camel_case = sensor.name.replace(/ /g, '_').toLowerCase();
      const sensorConfig = setupSensorConfig(
        stoveId,
        sensor.name,
        sensor.valueTemplate,
        sensor.deviceClass,
      );
      const topic = `homeassistant/sensor/mcz_${stoveId}/${name_camel_case}/config`;

      this.mqttService.publishMessage(topic, sensorConfig, true);
    });

    //publish binary sensor config
    binarySensors.forEach((sensor) => {
      const name_camel_case = sensor.name.replace(/ /g, '_').toLowerCase();
      const sensorConfig = setupBinarySensorConfig(
        stoveId,
        sensor.name,
        sensor.valueTemplate,
      );
      const topic = `homeassistant/binary_sensor/mcz_${stoveId}/${name_camel_case}/config`;

      this.mqttService.publishMessage(topic, sensorConfig, true);
    });

    //publish climate config
    const climateConfig = setupClimateConfig(stoveId);
    const climateTopic = `homeassistant/climate/mcz_${stoveId}/config`;
    this.mqttService.publishMessage(climateTopic, climateConfig, true);
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
