import {
  StoveState,
  StoveStatus,
} from '../../../core/entities/stove-state.entity';

export interface StoveMqttDto {
  action: 'off' | 'heating' | 'idle';
  mode_state: 'heat' | 'off';
  preset_mode_state: 'eco' | 'none';
  ecoStop: 'ON' | 'OFF';
  activated: 'ON' | 'OFF';
  sleepMode: 'ON' | 'OFF';
  regulationMode: 'ON' | 'OFF';
  autoMode: 'ON' | 'OFF';
  activeMode: 'ON' | 'OFF';
}

export const modeStateMapper = (stoveData: StoveState) => {
  switch (stoveData.activated) {
    case StoveStatus.ERROR:
      return 'off';
    case StoveStatus.OFF:
      return 'off';
    case StoveStatus.ON:
      return 'heat';
    case StoveStatus.IDLE:
      return 'heat';
    default:
      return 'off';
  }
};

export const actionMapper = (status: StoveStatus) => {
  switch (status) {
    case StoveStatus.ERROR:
      return 'off';
    case StoveStatus.OFF:
      return 'off';
    case StoveStatus.ON:
      return 'heating';
    case StoveStatus.IDLE:
      return 'idle';
    default:
      return 'off';
  }
};

//FIXME: Need to create their own mappers
export const stoveMqttRecordMapper = (stoveData: StoveState): StoveMqttDto => ({
  ...(stoveData as any),
  mode_state: modeStateMapper(stoveData),
  action: actionMapper(stoveData.activated),
  preset_mode_state: stoveData.ecoStop ? 'eco' : 'none',
  ecoStop: stoveData.ecoStop ? 'ON' : 'OFF',
  activated: stoveData.activated ? 'ON' : 'OFF',
  sleepMode: stoveData.sleepMode ? 'ON' : 'OFF',
  regulationMode: stoveData.regulationMode ? 'ON' : 'OFF',
  autoMode: stoveData.autoMode ? 'ON' : 'OFF',
  activeMode: stoveData.activeMode ? 'ON' : 'OFF',
});
