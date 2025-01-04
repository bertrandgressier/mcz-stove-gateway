import { Injectable, Logger } from '@nestjs/common';
import { StovePublisherPort } from '../port/driver/stove-publisher.port';
import { StoveRepositoryPort } from '../port/driver/stove-repository.port';

@Injectable()
export class HomeAssistantUseCase {
  private logger = new Logger(HomeAssistantUseCase.name);

  constructor(
    private readonly stovePublisherPort: StovePublisherPort,
    private readonly stoveRepository: StoveRepositoryPort,
  ) {}

  setupHomeAssistant() {
    this.stoveRepository.listStoves().forEach((stove) => {
      this.logger.log(`Setting up Home Assistant for stove [${stove.id}]`);
      this.stovePublisherPort.setupHomeAssistant(stove.id);
    });
  }
}
