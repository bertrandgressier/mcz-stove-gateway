import { StoveState } from '../../../core/entities/stove-state.entity';

export type StoveMqttDto = StoveState;

//FIXME: Need to create their own mappers
export const stoveMqttRecordMapper = (stoveData: StoveState): StoveMqttDto => ({
  ...stoveData,
});
