import { Injectable, Logger } from '@nestjs/common';
import { StoveControlPort } from '../port/driver/stove-control.port';

@Injectable()
export class TurnOnStoveUseCase {
  private readonly logger = new Logger(TurnOnStoveUseCase.name);

  constructor(private readonly stoveControl: StoveControlPort) {}

  async execute(stoveId: string): Promise<void> {
    this.logger.log(`[${stoveId}] Executing TurnOnStoveUseCase`);
    try {
      await this.stoveControl.turnOn(stoveId);
      this.logger.log(`[${stoveId}] TurnOnStoveUseCase executed successfully`);
    } catch (error) {
      this.logger.error(
        `[${stoveId}] Error executing TurnOnStoveUseCase`,
        error,
      );
      // Rethrow or handle error as appropriate for the application
      throw error;
    }
  }
}
