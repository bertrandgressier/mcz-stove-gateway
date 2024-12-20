import { Injectable, Logger } from '@nestjs/common';
import { StovePublisherPort } from '../port/driver/stove-publisher.port';

@Injectable()
export class StoveConnectionStatusUseCase {
  logger = new Logger(StoveConnectionStatusUseCase.name);

  constructor(private readonly publisher: StovePublisherPort) {}

  updateConnectionStatus(stoveId: string, connected: boolean): void {
    this.logger.debug(`Stove[${stoveId}] connection status : ${connected}`);
    this.publisher.connected(stoveId, connected);
  }
}
