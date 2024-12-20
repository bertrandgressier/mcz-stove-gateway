import { StoveState } from '../../entities/stove-state.entity';

export abstract class StovePublisherPort {
  abstract publish(stoveId: string, stove: StoveState): void;

  abstract connected(stoveId: string, status: boolean): void;
}
