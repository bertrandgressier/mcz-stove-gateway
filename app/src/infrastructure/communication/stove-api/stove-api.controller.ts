import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { StoveStateDto } from './stove-api.dto';
import { StoveApiService } from './stove-api.service';

@Controller()
export class StoveApiController {
  logger = new Logger(StoveApiController.name);

  constructor(private readonly stoveService: StoveApiService) {}

  @Get('stoves')
  listStoves() {
    this.logger.debug('Listing stoves...');
    return this.stoveService.listStoves();
  }

  @Post('stoves/:stoveId/connected/:connected')
  updateStoveConnectionStatus(
    @Param('stoveId') stoveId: string,
    @Param('connected') connected: string,
  ) {
    this.logger.debug(
      `Updating stove[${stoveId}] connection status to ${connected}`,
    );
    this.stoveService.setConnectionStatus(stoveId, connected === 'true');
  }

  @Post('stoves/:stoveId')
  updateStoveState(
    @Param('stoveId') stoveId: string,
    @Body() stoveData: StoveStateDto,
  ) {
    this.logger.debug(`Updating stove state for stoveId: ${stoveId}`);
    const stoves = this.stoveService.listStoves();
    if (!stoves.find((stove) => stove.id === stoveId)) {
      this.logger.error(`Stove[${stoveId}] not found`);
      throw new NotFoundException(`Stove[${stoveId}] not found`);
    }

    this.logger.debug(`Stove data: ${JSON.stringify(stoveData)}`);
    this.stoveService.updateStoveState(stoveId, stoveData);
  }
}
