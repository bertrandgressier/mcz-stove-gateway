import { Injectable, Logger } from '@nestjs/common';
import { StoveControlPort } from '../port/driver/stove-control.port';

@Injectable()
export class SetEcoStopModeUseCase {
  private readonly logger = new Logger(SetEcoStopModeUseCase.name);

  constructor(private readonly stoveControl: StoveControlPort) {}

  async execute(stoveId: string, enabled: boolean): Promise<void> {
    this.logger.log(
      `[${stoveId}] Executing SetEcoStopModeUseCase with enabled=${enabled}`,
    );
    try {
      await this.stoveControl.setEcoStopMode(stoveId, enabled);
      this.logger.log(
        `[${stoveId}] SetEcoStopModeUseCase executed successfully`,
      );
    } catch (error) {
      this.logger.error(
        `[${stoveId}] Error executing SetEcoStopModeUseCase`,
        error,
      );
      // Rethrow or handle error as appropriate for the application
      throw error;
    }
  }
}
