import { Injectable, Logger } from '@nestjs/common';
import { StoveControlPort } from '../port/driver/stove-control.port';

@Injectable()
export class TurnOffStoveUseCase {
  private readonly logger = new Logger(TurnOffStoveUseCase.name);

  constructor(private readonly stoveControl: StoveControlPort) {}

  async execute(stoveId: string): Promise<void> {
    this.logger.log(`[${stoveId}] Executing TurnOffStoveUseCase`);
    try {
      await this.stoveControl.turnOff(stoveId);
      this.logger.log(`[${stoveId}] TurnOffStoveUseCase executed successfully`);
    } catch (error) {
      this.logger.error(
        `[${stoveId}] Error executing TurnOffStoveUseCase`,
        error,
      );
      // Rethrow or handle error as appropriate for the application
      throw error;
    }
  }
}
