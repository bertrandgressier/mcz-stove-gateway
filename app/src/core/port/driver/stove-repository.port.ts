import { StoveEntity } from '../../entities/stove.entity';

export abstract class StoveRepositoryPort {
  abstract getStove(stoveId: string): StoveEntity | undefined;

  abstract listStoves(): StoveEntity[];
}
