import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { MczWsConfig } from '../../../config/configSchema';
import { maestroDecoder } from './mcz-decoder/maestroDecoder';
import { MaestroMessage, MaestroObject } from './mcz-decoder/mcz-stove.model';

enum MczWsEvents {
  Connect = 'connect',
  Disconnect = 'disconnect',
  ConnectError = 'connect_error',
  ConnectTimeout = 'connect_timeout',
  Answer = 'rispondo',
  Join = 'join',
  Command = 'chiedo',
}
// Constants for specific commands
const POWER_COMMAND_ID = 34;
const POWER_ON_VALUE = 1;
const POWER_OFF_VALUE = 40;

export enum MCZCommand {
  GetInfo = 'C|RecuperoInfo',
  GetParams = 'RecuperoParametri',
}

export interface MczStoveConnected {
  stoveId: string;
  connected: boolean;
}

export interface MczStoveData {
  stoveId: string;
  data: MaestroObject;
}

@Injectable()
export class MczStoveWebsocket {
  protected url: string;

  private stoves: Map<
    string,
    {
      socket: Socket;
      stoveId: string;
      macAddress: string;
    }
  >;

  logger = new Logger(MczStoveWebsocket.name);

  private wsConnected = new Subject<MczStoveConnected>();
  private receivedData = new Subject<MczStoveData>();

  constructor(config: ConfigService) {
    const { url } = config.get<MczWsConfig>('app.ws');
    this.url = url;
    this.stoves = new Map();

    this.onIsConnected().subscribe(({ stoveId, connected }) => {
      if (connected) {
        this.joinSession(stoveId);
      }
    });
  }

  onDataReceived() {
    return this.receivedData;
  }

  onIsConnected() {
    return this.wsConnected;
  }

  connect(serialId: string, macAddress: string) {
    this.logger.log(
      `Connecting to the MCZ websocket server ${this.url} for ${serialId}...`,
    );
    if (this.stoves.has(serialId)) {
      this.logger.warn(`Already connected to the stove ${serialId}`);
      return;
    }

    this.stoves.set(serialId, {
      socket: this.createSocket(serialId),
      stoveId: serialId,
      macAddress,
    });
  }

  private createSocket(serialId: string) {
    const socket = io(this.url, {
      transports: ['websocket', 'polling'],
    });

    socket.on(MczWsEvents.Connect, () => {
      this.logger.log(`[${serialId}] Connected to the websocket`);
      this.wsConnected.next({ stoveId: serialId, connected: true });
    });

    socket.on(MczWsEvents.Answer, (data: MaestroMessage) => {
      this.logger.debug(`[${serialId}] Received data`);
      try {
        const response = maestroDecoder(data);
        if (response) {
          this.receivedData.next({
            stoveId: serialId,
            data: response,
          });
        }
      } catch (error) {
        this.logger.error(`[${serialId}] Error decoding data: ${data}`, error);
      }
    });

    socket.on(MczWsEvents.Disconnect, () => {
      this.logger.log('[${serialId}] Disconnected from the websocket');
      this.wsConnected.next({ stoveId: serialId, connected: false });
    });

    socket.on(MczWsEvents.ConnectError, (err: any) => {
      this.logger.error(`[${serialId}] connect_error: ${err}`);
      this.wsConnected.next({ stoveId: serialId, connected: false });
    });
    socket.on(MczWsEvents.ConnectTimeout, (err: any) => {
      this.logger.error(`[${serialId}] connect_timeout: ${err}`);
      this.wsConnected.next({ stoveId: serialId, connected: false });
    });

    return socket;
  }

  joinSession(stoveId: string) {
    this.logger.log(`[${stoveId}] Asking to join the session`);
    const stove = this.stoves.get(stoveId);
    if (!stove) {
      this.logger.warn(`[${stoveId}] Stove not found`);
      return;
    }
    stove.socket.emit(MczWsEvents.Join, {
      serialNumber: stove.stoveId,
      macAddress: stove.macAddress,
      type: 'Android-App',
    });
  }

  sendRequest(stoveId: string, callType: number, request: MCZCommand) {
    const stove = this.stoves.get(stoveId);
    if (!stove) {
      this.logger.warn(`[${stoveId}] Stove not found`);
      return;
    }

    stove.socket.emit(MczWsEvents.Command, {
      serialNumber: stove.stoveId,
      macAddress: stove.macAddress,
      tipoChiamata: callType,
      richiesta: request,
    });
  }
  /**
   * Sends a command with a specific ID and value to the stove.
   * Used for commands that require setting a specific parameter value.
   * @param stoveId The serial number of the stove.
   * @param commandId The numeric ID of the command (e.g., 34 for power).
   * @param value The value to set for the command (e.g., 1 for ON, 40 for OFF).
   */
  sendCommandWithValue(
    stoveId: string,
    commandId: number,
    value: number | string,
  ): void {
    const stove = this.stoves.get(stoveId);
    if (!stove) {
      this.logger.warn(
        `[${stoveId}] Stove not found, cannot send command ${commandId}`,
      );
      return;
    }

    this.logger.log(
      `[${stoveId}] Sending command ID ${commandId} with value ${value}`,
    );

    // Construct the command string based on Python reference implementations
    // Format: C|WriteParametri|{commandId}|{value}
    const commandString = `C|WriteParametri|${commandId}|${value}`;

    // Emit the 'chiedo' event with a JSON payload containing the command string
    // based on the second Python script example. tipoChiamata is set to 1.
    stove.socket.emit(MczWsEvents.Command, {
      serialNumber: stove.stoveId,
      macAddress: stove.macAddress,
      tipoChiamata: 1, // Using 1 based on the second Python script's send function
      richiesta: commandString,
    });
  }
}
