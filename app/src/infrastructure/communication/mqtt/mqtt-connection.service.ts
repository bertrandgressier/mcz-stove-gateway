import { Injectable, Logger } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { MqttClient } from 'mqtt';
import { Subject } from 'rxjs';
import { MqttConfig } from '../../../config/configSchema';

@Injectable()
export class MqttConnectionService {
  private client: MqttClient;
  private logger = new Logger(MqttConnectionService.name);

  private readonly mqttConnected = new Subject<boolean>();
  private readonly receivedMessages = new Subject<{
    topic: string;
    message: Buffer;
  }>();
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
      this.logger.log('MQTT client connected');
      this.mqttConnected.next(true);
      // Setup message listener upon connection
      this.client.on('message', (topic, message) => {
        this.logger.debug(`Received message on topic ${topic}`);
        this.receivedMessages.next({ topic, message });
      });
    });

    this.client.on('error', (err) => {
      Logger.error(`Error MQTT: ${err}`);
    });

    this.client.on('close', () => {
      this.mqttConnected.next(false);
    });
  }

  subscribe(topic: string) {
    if (!this.client || !this.client.connected) {
      this.logger.warn(
        `MQTT client not connected, cannot subscribe to ${topic}`,
      );
      return;
    }
    this.client.subscribe(topic, (err) => {
      if (err) {
        this.logger.error(`Error subscribing to topic ${topic}: ${err}`);
      } else {
        this.logger.log(`Successfully subscribed to topic: ${topic}`);
      }
    });
  }

  publishStoveMessage(topic: string, object: any) {
    this.publishMessage(`${this.mqttTopicPath}/${topic}`, object, true);
  }

  publishMessage(topic: string, object: any, retain = false) {
    let message;
    if (typeof object === 'string') {
      message = object;
    } else {
      message = JSON.stringify(object);
    }
    this.client.publish(topic, message, { qos: 0, retain }, (err) => {
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

  onMessage() {
    return this.receivedMessages;
  }
}
