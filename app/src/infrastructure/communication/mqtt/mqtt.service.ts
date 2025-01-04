import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MqttConfig } from '../../../config/configSchema';
import { MqttConnectionService } from './mqtt-connection.service';

@Injectable()
export class MqttService implements OnApplicationBootstrap {
  private logger = new Logger(MqttService.name);
  private readonly config: MqttConfig;

  constructor(
    private configService: ConfigService,
    private mqtt: MqttConnectionService,
  ) {
    this.config = this.configService.get<MqttConfig>('app.mqtt');
  }

  onApplicationBootstrap() {
    this.mqtt.connect(this.config);

    this.mqtt.onConnected().subscribe((connected) => {
      this.logger.debug(`MQTT connection status: ${connected}`);
    });
  }
}
