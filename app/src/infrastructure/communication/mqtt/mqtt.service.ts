import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MqttConfig } from '../../../config/configSchema';
import { TurnOffStoveUseCase } from '../../../core/use-cases/turn-off-stove.use-case';
import { TurnOnStoveUseCase } from '../../../core/use-cases/turn-on-stove.use-case';
import { MqttConnectionService } from './mqtt-connection.service';

@Injectable()
export class MqttService implements OnApplicationBootstrap, OnModuleInit {
  private logger = new Logger(MqttService.name);
  private readonly config: MqttConfig;

  constructor(
    private configService: ConfigService,
    private readonly mqtt: MqttConnectionService,
    private readonly turnOnStoveUseCase: TurnOnStoveUseCase,
    private readonly turnOffStoveUseCase: TurnOffStoveUseCase,
  ) {
    this.config = this.configService.get<MqttConfig>('app.mqtt');
  }

  async onModuleInit() {
    // Ensure connection is established before subscribing
    await this.mqtt.connect(this.config);
  }

  onApplicationBootstrap() {
    // Subscribe once connected
    this.mqtt.onConnected().subscribe((connected) => {
      this.logger.debug(`MQTT connection status: ${connected}`);
      if (connected) {
        this.subscribeToCommands();
      }
    });
  }

  private subscribeToCommands() {
    const commandTopicPattern = `${this.config.mqttTopicPath}/+/command/power`;
    this.logger.log(
      `Subscribing to MQTT command topic: ${commandTopicPattern}`,
    );

    this.mqtt.subscribe(commandTopicPattern);

    this.mqtt.onMessage().subscribe(({ topic, message }) => {
      if (topic.match(commandTopicPattern.replace('+', '[^/]+'))) {
        this.handlePowerCommand(topic, message);
      }
    });
  }

  private async handlePowerCommand(topic: string, message: Buffer) {
    const topicParts = topic.split('/');
    // Assuming topic structure: {mqttTopicPath}/{stoveId}/command/power
    const stoveIdIndex = this.config.mqttTopicPath.split('/').length;
    if (topicParts.length <= stoveIdIndex + 2) {
      this.logger.error(`Invalid command topic structure: ${topic}`);
      return;
    }
    const stoveId = topicParts[stoveIdIndex];
    const command = message.toString().toUpperCase();

    this.logger.log(
      `Received power command for stove ${stoveId}: ${command} on topic ${topic}`,
    );

    try {
      if (command === 'ON') {
        await this.turnOnStoveUseCase.execute(stoveId);
        this.logger.log(`Turn ON use case executed for stove ${stoveId}`);
      } else if (command === 'OFF') {
        await this.turnOffStoveUseCase.execute(stoveId);
        this.logger.log(`Turn OFF use case executed for stove ${stoveId}`);
      } else {
        this.logger.warn(
          `Received unknown power command for stove ${stoveId}: ${command}`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Error executing power command for stove ${stoveId}: ${command}`,
        error,
      );
    }
  }
}
