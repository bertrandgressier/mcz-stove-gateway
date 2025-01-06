import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { StoveState } from '../../../core/entities/stove-state.entity';
import { GetStovesUseCase } from '../../../core/use-cases/get-stoves.use-case';
import { StoveConnectionStatusUseCase } from '../../../core/use-cases/stove-connection-status.use-case';
import { UpdateStoveStateUseCase } from '../../../core/use-cases/update-stove-state.use-case';
import { StoveStateDto } from './stove-api.dto';

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

  updateStoveState(stoveId: string, stoveData: StoveStateDto) {
    const stoveState: StoveState = {
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
      activated: stoveData.activated,
      fanMode: stoveData.fanMode,
    };
    this.updateStoveInformation.updateStoveState(stoveId, stoveState);
  }
}
