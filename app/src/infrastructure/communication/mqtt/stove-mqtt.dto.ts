import { StoveState } from '../../../core/entities/stove-state.entity';

export interface StoveMqttDto {
  mode_state: 'heat' | 'off';
  preset_mode_state: 'eco' | 'none';
  ecoStop: 'ON' | 'OFF';
  activated: 'ON' | 'OFF';
  sleepMode: 'ON' | 'OFF';
  regulationMode: 'ON' | 'OFF';
  autoMode: 'ON' | 'OFF';
  activeMode: 'ON' | 'OFF';
}

//FIXME: Need to create their own mappers
export const stoveMqttRecordMapper = (stoveData: StoveState): StoveMqttDto => ({
  ...(stoveData as any),
  mode_state: stoveData.activated ? 'heat' : 'off',
  preset_mode_state: stoveData.ecoStop ? 'eco' : 'none',
  ecoStop: stoveData.ecoStop ? 'ON' : 'OFF',
  activated: stoveData.activated ? 'ON' : 'OFF',
  sleepMode: stoveData.sleepMode ? 'ON' : 'OFF',
  regulationMode: stoveData.regulationMode ? 'ON' : 'OFF',
  autoMode: stoveData.autoMode ? 'ON' : 'OFF',
  activeMode: stoveData.activeMode ? 'ON' : 'OFF',
});
