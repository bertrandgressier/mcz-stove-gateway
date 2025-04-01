import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import {
  FanMode,
  StovePower,
  StoveState,
  StoveStatus,
} from '../../../core/entities/stove-state.entity';
import { GetStovesUseCase } from '../../../core/use-cases/get-stoves.use-case';
import { StoveConnectionStatusUseCase } from '../../../core/use-cases/stove-connection-status.use-case';
import { UpdateStoveStateUseCase } from '../../../core/use-cases/update-stove-state.use-case';
import {
  MaestroObject,
  MczFanState,
  StoveStateStatus,
} from './mcz-decoder/mcz-stove.model';
import { MCZCommand, MczStoveWebsocket } from './mczStoveWebsocket';

@Injectable()
export class WebsocketService implements OnApplicationBootstrap {
  logger = new Logger(WebsocketService.name);

  constructor(
    private mczStoveWebsocket: MczStoveWebsocket,
    private updateStoveInformation: UpdateStoveStateUseCase,
    private stoveConnectionStatus: StoveConnectionStatusUseCase,
    private stovesService: GetStovesUseCase,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  onApplicationBootstrap() {
    const stoves = this.stovesService.getStoves();
    this.logger.debug(`List of stoves: ${JSON.stringify(stoves)}`);

    this.mczStoveWebsocket.onDataReceived().subscribe(({ stoveId, data }) => {
      this.updateStoveInformation.updateStoveState(
        stoveId,
        this.stoveEntityMapper(data),
      );
    });

    this.mczStoveWebsocket
      .onIsConnected()
      .subscribe(({ stoveId, connected }) => {
        this.stoveConnectionStatus.updateConnectionStatus(stoveId, connected);
        if (connected) {
          this.schedulerRegistry.getCronJob(stoveId).start();
        } else {
          this.schedulerRegistry.getCronJob(stoveId).stop();
        }
      });

    this.logger.log('Setup StoveEntity Scheduler');
    stoves.forEach((stove) => {
      //to avoid that all stoves send the request at the same time
      const randomSecond = Math.floor(Math.random() * 60);
      this.schedulerRegistry.addCronJob(
        stove.id,
        // Run every 30 seconds at a random offset
        new CronJob(`${randomSecond}/30 * * * * *`, () => {
          this.mczStoveWebsocket.sendRequest(stove.id, 1, MCZCommand.GetInfo);
        }),
      );
    });

    this.logger.log('Connecting to the MCZ websocket server...');
    stoves.forEach((stove) => {
      this.mczStoveWebsocket.connect(stove.id, stove.macAddress);
    });
  }

  private powerMapper(power: number): StovePower {
    switch (power) {
      case 0:
        return StovePower.OFF;
      case 11:
        return StovePower.POWER_1;
      case 12:
        return StovePower.POWER_2;
      case 13:
        return StovePower.POWER_3;
      case 14:
        return StovePower.POWER_4;
      case 15:
        return StovePower.POWER_5;
      default:
        return StovePower.OFF;
    }
  }

  private fanModeMapper(fanMode: MczFanState): number {
    if (fanMode.auto) {
      return FanMode.AUTO;
    }
    if (!fanMode.on) {
      return FanMode.OFF;
    }
    switch (fanMode.level) {
      case 1:
        return FanMode.POWER_1;
      case 2:
        return FanMode.POWER_2;
      case 3:
        return FanMode.POWER_3;
      case 4:
        return FanMode.POWER_4;
      case 5:
        return FanMode.POWER_5;
      default:
        return FanMode.OFF;
    }
  }

  private statusMapper(status: StoveStateStatus): StoveStatus {
    switch (status) {
      case StoveStateStatus.ERROR:
        return StoveStatus.ERROR;
      case StoveStateStatus.OFF:
        return StoveStatus.OFF;
      case StoveStateStatus.ON:
        return StoveStatus.ON;
      case StoveStateStatus.IDLE:
        return StoveStatus.IDLE;
      default:
        return StoveStatus.ERROR;
    }
  }

  private stoveEntityMapper(data: MaestroObject): StoveState {
    return {
      statusId: data.stoveStatus.id,
      statusDescription: data.stoveStatus.description,
      activated: this.statusMapper(data.stoveStatus.state),
      activeTemperature: data.activeLive,
      autoMode: data.chronometerThermostatMode ?? false,
      ecoStop: data.ecoMode ?? false,
      fanMode: this.fanModeMapper(data.fanAmbienceState),
      sleepMode: data.sleepMode ?? false,

      motherBoardTemperature: data.motherboardTemperature,
      activePower: this.powerMapper(data.activePower),
      rpmFeedingScrew: data.feederScrewLiveRPM,
      rpmFumes: data.fanFumeRPM,
      smokesTemperature: data.fumeTemperature,
      ambientTemperature: data.ambientTemperature,
      targetTemperature: data.setTemperature,
      regulationMode: data.regulationMode ?? false,
      activeMode: data.activeModeState ?? false,
      powerOperating: {
        hoursService: data.maintenanceHours,
        power1Operating: data.power1Operating,
        power2Operating: data.power2Operating,
        power3Operating: data.power3Operating,
        power4Operating: data.power4Operating,
        power5Operating: data.power5Operating,
      },
      timestamp: Date.now(),
    };
  }
}
