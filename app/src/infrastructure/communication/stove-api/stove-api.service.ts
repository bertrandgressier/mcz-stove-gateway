import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import {
  StoveState,
  StoveStatus,
} from '../../../core/entities/stove-state.entity';
import { GetStovesUseCase } from '../../../core/use-cases/get-stoves.use-case';
import { StoveConnectionStatusUseCase } from '../../../core/use-cases/stove-connection-status.use-case';
import { UpdateStoveStateUseCase } from '../../../core/use-cases/update-stove-state.use-case';
import { StoveStateDto, StoveStatusDto } from './stove-api.dto';

@Injectable()
export class StoveApiService implements OnApplicationBootstrap {
  logger = new Logger(StoveApiService.name);

  constructor(
    private updateStoveInformation: UpdateStoveStateUseCase,
    private stoveConnectionStatus: StoveConnectionStatusUseCase,
    private stovesService: GetStovesUseCase,
  ) {}

  onApplicationBootstrap() {
    this.logger.log('Start StoveApiService - Fake Stove API');
    const stoves = this.stovesService.getStoves();
    this.logger.debug(`List of stoves: ${JSON.stringify(stoves)}`);
  }

  listStoves() {
    return this.stovesService.getStoves();
  }

  setConnectionStatus(stoveId: string, connected: boolean) {
    this.stoveConnectionStatus.updateConnectionStatus(stoveId, connected);
  }

  private stoveStatusMapper(status: StoveStatusDto): StoveStatus {
    switch (status) {
      case StoveStatusDto.OFF:
        return StoveStatus.OFF;
      case StoveStatusDto.ON:
        return StoveStatus.ON;
      case StoveStatusDto.ERROR:
        return StoveStatus.ERROR;
      case StoveStatusDto.IDLE:
        return StoveStatus.IDLE;
      default:
        return StoveStatus.OFF;
    }
  }

  updateStoveState(stoveId: string, stoveData: StoveStateDto) {
    const stoveState: StoveState = {
      statusId: stoveData.statusId,
      statusDescription: stoveData.statusDescription,
      activeMode: stoveData.activeMode,
      activePower: stoveData.activePower,
      activeTemperature: stoveData.activeTemperature,
      ambientTemperature: stoveData.ambientTemperature,
      autoMode: stoveData.autoMode,
      ecoStop: stoveData.ecoStop,
      motherBoardTemperature: stoveData.motherBoardTemperature,
      powerOperating: stoveData.powerOperating,
      regulationMode: stoveData.regulationMode,
      rpmFeedingScrew: stoveData.rpmFeedingScrew,
      rpmFumes: stoveData.rpmFumes,
      sleepMode: stoveData.sleepMode,
      smokesTemperature: stoveData.smokesTemperature,
      targetTemperature: stoveData.targetTemperature,
      timestamp: Date.now(),
      activated: this.stoveStatusMapper(stoveData.activated),
      fanMode: stoveData.fanMode,
    };
    this.updateStoveInformation.updateStoveState(stoveId, stoveState);
  }
}
