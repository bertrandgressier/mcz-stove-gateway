import { Injectable, Logger } from '@nestjs/common';
import { StoveControlPort } from '../port/driver/stove-control.port';

@Injectable()
export class SetTargetTemperatureUseCase {
  private readonly logger = new Logger(SetTargetTemperatureUseCase.name);

  constructor(private readonly stoveControl: StoveControlPort) {}

  async execute(stoveId: string, temperature: number): Promise<void> {
    this.logger.log(
      `[${stoveId}] Executing SetTargetTemperatureUseCase with temp ${temperature}°C`,
    );
    try {
      // Add any validation logic here if needed (e.g., check min/max temp)
      await this.stoveControl.setTargetTemperature(stoveId, temperature);
      this.logger.log(
        `[${stoveId}] SetTargetTemperatureUseCase executed successfully`,
      );
    } catch (error) {
      this.logger.error(
        `[${stoveId}] Error executing SetTargetTemperatureUseCase`,
        error,
      );
      // Rethrow or handle error as appropriate for the application
      throw error;
    }
  }
}
