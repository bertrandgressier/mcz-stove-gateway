import { Injectable, Logger } from '@nestjs/common';
import { StoveControlPort } from '../../core/port/driver/stove-control.port';
import { MczStoveWebsocket } from './mcz-stove-websocket/mczStoveWebsocket';

// TODO: Define these constants properly, perhaps in a shared location or config
const POWER_COMMAND_ID = 34;
const POWER_ON_VALUE = 1;
const POWER_OFF_VALUE = 40;

@Injectable()
export class StoveControlAdapter implements StoveControlPort {
  private readonly logger = new Logger(StoveControlAdapter.name);

  constructor(private readonly mczWebsocket: MczStoveWebsocket) {}

  async turnOn(stoveId: string): Promise<void> {
    this.logger.log(`[${stoveId}] Attempting to turn ON stove via adapter`);
    try {
      this.mczWebsocket.sendCommandWithValue(
        stoveId,
        POWER_COMMAND_ID,
        POWER_ON_VALUE,
      );
      this.logger.log(`[${stoveId}] Turn ON command sent successfully`);
    } catch (error) {
      this.logger.error(`[${stoveId}] Error sending Turn ON command`, error);
      throw error; // Rethrow the error to be handled by the use case
    }
  }

  async turnOff(stoveId: string): Promise<void> {
    this.logger.log(`[${stoveId}] Attempting to turn OFF stove via adapter`);
    try {
      this.mczWebsocket.sendCommandWithValue(
        stoveId,
        POWER_COMMAND_ID,
        POWER_OFF_VALUE,
      );
      this.logger.log(`[${stoveId}] Turn OFF command sent successfully`);
    } catch (error) {
      this.logger.error(`[${stoveId}] Error sending Turn OFF command`, error);
      throw error; // Rethrow the error to be handled by the use case
    }
  }
}
