import { Injectable, Logger } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { MqttClient } from 'mqtt';
import { Subject } from 'rxjs';
import { MqttConfig } from '../../../config/configSchema';

@Injectable()
export class MqttConnectionService {
  private client: MqttClient;
  private logger = new Logger(MqttConnectionService.name);

  private mqttConnected = new Subject<boolean>();
  private mqttTopicPath: string = 'websocket';

  connect(mqttConfig: MqttConfig) {
    const { url, username, password, mqttTopicPath } = mqttConfig;
    this.mqttTopicPath = mqttTopicPath;

    this.client = mqtt.connect(url, {
      clientId: 'websocket-ha',
      username,
      password,
      connectTimeout: 10000,
      reconnectPeriod: 5000,
    });

    this.client.on('connect', () => {
      this.mqttConnected.next(true);
    });

    this.client.on('error', (err) => {
      Logger.error(`Error MQTT: ${err}`);
    });

    this.client.on('close', () => {
      this.mqttConnected.next(false);
    });
  }

  publishStoveMessage(topic: string, object: any) {
    this.publishMessage(`${this.mqttTopicPath}/${topic}`, object);
  }

  publishMessage(topic: string, object: any) {
    const message = JSON.stringify(object);
    this.client.publish(topic, message, { qos: 0 }, (err) => {
      if (err) {
        this.logger.error(`Publish mqtt message error: ${err}`);
      } else {
        this.logger.debug('Message published successfully');
      }
    });
  }

  onConnected() {
    return this.mqttConnected;
  }
}
