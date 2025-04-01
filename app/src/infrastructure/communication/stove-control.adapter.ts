import { Injectable, Logger } from '@nestjs/common';
import { StoveControlPort } from '../../core/port/driver/stove-control.port';
import {
  MCZCommand,
  MczStoveWebsocket,
} from './mcz-stove-websocket/mczStoveWebsocket';

// TODO: Define these constants properly, perhaps in a shared location or config
const POWER_COMMAND_ID = 34;
const POWER_ON_VALUE = 1;
const POWER_OFF_VALUE = 40;
const TEMP_SETPOINT_COMMAND_ID = 42;
const ECO_STOP_COMMAND_ID = 41;

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
      // Request immediate state update
      this.requestStateUpdate(stoveId);
    } catch (error) {
      this.logger.error(`[${stoveId}] Error sending Turn ON command`, error);
      throw error; // Rethrow the error to be handled by the use case
    }
  }

  async setTargetTemperature(
    stoveId: string,
    temperature: number,
  ): Promise<void> {
    this.logger.log(
      `[${stoveId}] Attempting to set target temperature to ${temperature}°C via adapter`,
    );
    try {
      // Value needs to be multiplied by 2 for the API
      const apiValue = Math.round(temperature * 2);
      this.mczWebsocket.sendCommandWithValue(
        stoveId,
        TEMP_SETPOINT_COMMAND_ID,
        apiValue,
      );
      this.logger.log(
        `[${stoveId}] Set target temperature command (value: ${apiValue}) sent successfully`,
      );
      // Request immediate state update
      this.requestStateUpdate(stoveId);
    } catch (error) {
      this.logger.error(
        `[${stoveId}] Error sending set target temperature command`,
        error,
      );
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
      // Request immediate state update
      this.requestStateUpdate(stoveId);
    } catch (error) {
      this.logger.error(`[${stoveId}] Error sending Turn OFF command`, error);
      throw error; // Rethrow the error to be handled by the use case
    }
  }

  async setEcoStopMode(stoveId: string, enabled: boolean): Promise<void> {
    const value = enabled ? 1 : 0;
    this.logger.log(
      `[${stoveId}] Attempting to set Eco Stop mode to ${enabled} (value: ${value}) via adapter`,
    );
    try {
      this.mczWebsocket.sendCommandWithValue(
        stoveId,
        ECO_STOP_COMMAND_ID,
        value,
      );
      this.logger.log(
        `[${stoveId}] Set Eco Stop mode command (value: ${value}) sent successfully`,
      );
      // Request immediate state update
      this.requestStateUpdate(stoveId);
    } catch (error) {
      this.logger.error(
        `[${stoveId}] Error sending set Eco Stop mode command`,
        error,
      );
      throw error; // Rethrow the error to be handled by the use case
    }
  }

  /**
   * Helper method to request a state update after sending a command.
   */
  private requestStateUpdate(stoveId: string) {
    try {
      this.logger.debug(`[${stoveId}] Requesting state update after command`);
      // Assuming MCZCommand enum is accessible or imported
      // If not, we might need to adjust imports or pass MCZCommand.GetInfo directly
      this.mczWebsocket.sendRequest(stoveId, 1, MCZCommand.GetInfo);
    } catch (error) {
      this.logger.error(
        `[${stoveId}] Failed to request state update after command`,
        error,
      );
    }
  }
}
