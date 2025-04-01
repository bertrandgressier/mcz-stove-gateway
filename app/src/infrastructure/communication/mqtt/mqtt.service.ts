import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MqttConfig } from '../../../config/configSchema';
import { SetEcoStopModeUseCase } from '../../../core/use-cases/set-eco-stop-mode.use-case';
import { SetTargetTemperatureUseCase } from '../../../core/use-cases/set-target-temperature.use-case';
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
    private readonly setTargetTemperatureUseCase: SetTargetTemperatureUseCase,
    private readonly setEcoStopModeUseCase: SetEcoStopModeUseCase,
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
    const powerCommandTopic = `${this.config.mqttTopicPath}/+/command/power`;
    const tempCommandTopic = `${this.config.mqttTopicPath}/+/command/target_temperature`;
    const ecoStopCommandTopic = `${this.config.mqttTopicPath}/+/command/eco_stop`;

    this.logger.log(
      `Subscribing to MQTT power command topic: ${powerCommandTopic}`,
    );
    this.mqtt.subscribe(powerCommandTopic);

    this.logger.log(
      `Subscribing to MQTT temperature command topic: ${tempCommandTopic}`,
    );
    this.mqtt.subscribe(tempCommandTopic);

    this.logger.log(
      `Subscribing to MQTT Eco Stop command topic: ${ecoStopCommandTopic}`,
    );
    this.mqtt.subscribe(ecoStopCommandTopic);

    this.mqtt.onMessage().subscribe(({ topic, message }) => {
      // Use regex to match topics and extract stoveId
      const powerMatch = topic.match(powerCommandTopic.replace('+', '([^/]+)'));
      const tempMatch = topic.match(tempCommandTopic.replace('+', '([^/]+)'));
      const ecoStopMatch = topic.match(
        ecoStopCommandTopic.replace('+', '([^/]+)'),
      );

      if (powerMatch) {
        const stoveId = powerMatch[1];
        this.handlePowerCommand(stoveId, message);
      } else if (tempMatch) {
        const stoveId = tempMatch[1];
        this.handleTemperatureCommand(stoveId, message);
      } else if (ecoStopMatch) {
        const stoveId = ecoStopMatch[1];
        this.handleEcoStopCommand(stoveId, message);
      }
    });
  }

  private async handlePowerCommand(stoveId: string, message: Buffer) {
    const command = message.toString().toUpperCase();
    this.logger.log(`Received power command for stove ${stoveId}: ${command}`);

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

  private async handleTemperatureCommand(stoveId: string, message: Buffer) {
    const temperatureString = message.toString();
    const temperature = parseFloat(temperatureString);

    this.logger.log(
      `Received target temperature command for stove ${stoveId}: ${temperatureString}`,
    );

    if (isNaN(temperature)) {
      this.logger.warn(
        `Received invalid temperature value for stove ${stoveId}: ${temperatureString}`,
      );
      return;
    }

    try {
      await this.setTargetTemperatureUseCase.execute(stoveId, temperature);
      this.logger.log(
        `Set target temperature use case executed for stove ${stoveId}`,
      );
    } catch (error) {
      this.logger.error(
        `Error executing set target temperature command for stove ${stoveId}: ${temperatureString}`,
        error,
      );
    }
  }

  private async handleEcoStopCommand(stoveId: string, message: Buffer) {
    const command = message.toString().toUpperCase();
    this.logger.log(
      `Received Eco Stop command for stove ${stoveId}: ${command}`,
    );

    let enabled: boolean;
    if (command === 'ON') {
      enabled = true;
    } else if (command === 'OFF') {
      enabled = false;
    } else {
      this.logger.warn(
        `Received unknown Eco Stop command for stove ${stoveId}: ${command}`,
      );
      return;
    }

    try {
      await this.setEcoStopModeUseCase.execute(stoveId, enabled);
      this.logger.log(
        `Set Eco Stop mode use case executed for stove ${stoveId}`,
      );
    } catch (error) {
      this.logger.error(
        `Error executing set Eco Stop mode command for stove ${stoveId}: ${command}`,
        error,
      );
    }
  }
}
