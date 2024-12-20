import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StoveConfig } from '../../config/configSchema';
import { StoveEntity } from '../../core/entities/stove.entity';
import { StoveRepositoryPort } from '../../core/port/driver/stove-repository.port';

@Injectable()
export class StoveRepository implements StoveRepositoryPort {
  stoves: StoveEntity[] = [];

  constructor(config: ConfigService) {
    config.get<StoveConfig[]>('app.stoves').forEach((stove) => {
      this.stoves.push(new StoveEntity(stove.serialNumber, stove.macAddress));
    });
  }

  getStove(stoveId: string) {
    return this.stoves.find((stove) => stove.id === stoveId);
  }

  listStoves(): StoveEntity[] {
    return this.stoves;
  }
}
