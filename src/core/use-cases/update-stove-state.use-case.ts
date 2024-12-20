import { Injectable, Logger } from '@nestjs/common';
import { StoveState } from '../entities/stove-state.entity';
import { StovePublisherPort } from '../port/driver/stove-publisher.port';

@Injectable()
export class UpdateStoveStateUseCase {
  private logger = new Logger(UpdateStoveStateUseCase.name);

  constructor(private readonly publisher: StovePublisherPort) {}

  updateStoveState(stoveId: string, stoveData: StoveState) {
    this.logger.log(`[${stoveId}] Updating stove state...`);
    this.publisher.publish(stoveId, stoveData);
  }
}
