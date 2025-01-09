export interface MaestroMessage {
  stringaRicevuta: string;
  socketChiamata: string;
}

export enum MessageType {
  MESSAGE = '00',
  DATA = '01',
}

export enum StoveStateStatus {
  OFF = 'OFF',
  IDLE = 'IDLE',
  ON = 'ON',
  ERROR = 'ERROR',
}

export interface MczStoveState {
  id: number;
  description: string;
  state: StoveStateStatus;
}

export interface MczFanState {
  id: number;
  description: string;
  on: boolean;
  level: number;
  auto: boolean;
}

export const fanStates: MczFanState[] = [
  { id: 0, description: 'Off', on: false, level: 0, auto: false },
  { id: 1, description: 'Level 1', on: true, level: 1, auto: false },
  { id: 2, description: 'Level 2', on: true, level: 2, auto: false },
  { id: 3, description: 'Level 3', on: true, level: 3, auto: false },
  { id: 4, description: 'Level 4', on: true, level: 4, auto: false },
  { id: 5, description: 'Level 5', on: true, level: 5, auto: false },
  { id: 6, description: 'Auto', on: true, level: 0, auto: true },
];

export const stoveStates: MczStoveState[] = [
  { id: -1, description: 'Unknown', state: StoveStateStatus.ERROR },
  { id: 0, description: 'Off', state: StoveStateStatus.OFF },
  { id: 1, description: 'Checking hot or cold', state: StoveStateStatus.ON },
  { id: 2, description: 'Cleaning cold', state: StoveStateStatus.ON },
  { id: 3, description: 'Loading Pellets Cold', state: StoveStateStatus.ON },
  { id: 4, description: 'Start 1 Cold', state: StoveStateStatus.ON },
  { id: 5, description: 'Start 2 Cold', state: StoveStateStatus.ON },
  { id: 6, description: 'Cleaning Hot', state: StoveStateStatus.ON },
  { id: 7, description: 'Loading Pellets Hot', state: StoveStateStatus.ON },
  { id: 8, description: 'Start 1 Hot', state: StoveStateStatus.ON },
  { id: 9, description: 'Start 2 Hot', state: StoveStateStatus.ON },
  { id: 10, description: 'Stabilizing', state: StoveStateStatus.ON },
  { id: 11, description: 'Power 1', state: StoveStateStatus.ON },
  { id: 12, description: 'Power 2', state: StoveStateStatus.ON },
  { id: 13, description: 'Power 3', state: StoveStateStatus.ON },
  { id: 14, description: 'Power 4', state: StoveStateStatus.ON },
  { id: 15, description: 'Power 5', state: StoveStateStatus.ON },
  { id: 30, description: 'Diagnostics', state: StoveStateStatus.ON },
  { id: 31, description: 'On', state: StoveStateStatus.ON },
  { id: 40, description: 'Shutdown', state: StoveStateStatus.IDLE },
  { id: 41, description: 'Cooling', state: StoveStateStatus.IDLE },
  { id: 42, description: 'Cleaning Low', state: StoveStateStatus.IDLE },
  { id: 43, description: 'Cleaning High', state: StoveStateStatus.IDLE },
  { id: 44, description: 'UNLOCKING SCREW', state: StoveStateStatus.IDLE },
  { id: 45, description: 'Auto Eco', state: StoveStateStatus.IDLE },
  { id: 46, description: 'Standby', state: StoveStateStatus.IDLE },
  { id: 48, description: 'Diagnostics', state: StoveStateStatus.IDLE },
  { id: 49, description: 'Loading Auger', state: StoveStateStatus.IDLE },
  {
    id: 50,
    description: 'Error A01 - Ignition failed',
    state: StoveStateStatus.ERROR,
  },
  {
    id: 51,
    description: 'Error A02 - No flame',
    state: StoveStateStatus.ERROR,
  },
  {
    id: 52,
    description: 'Error A03 - Tank overheating',
    state: StoveStateStatus.ERROR,
  },
  {
    id: 53,
    description: 'Error A04 - Flue gas temperature too high',
    state: StoveStateStatus.ERROR,
  },
  {
    id: 54,
    description: 'Error A05 - Duct obstruction - Wind',
    state: StoveStateStatus.ERROR,
  },
  {
    id: 55,
    description: 'Error A06 - Bad printing',
    state: StoveStateStatus.ERROR,
  },
  {
    id: 56,
    description: 'Error A09 - SMOKE PROBE',
    state: StoveStateStatus.ERROR,
  },
  {
    id: 57,
    description: 'Error A11 - GEAR MOTOR',
    state: StoveStateStatus.ERROR,
  },
  {
    id: 58,
    description: 'Error A13 - MOTHERBOARD TEMPERATURE',
    state: StoveStateStatus.ERROR,
  },
  {
    id: 59,
    description: 'Error A14 - DEFECT ACTIVE',
    state: StoveStateStatus.ERROR,
  },
  {
    id: 60,
    description: 'Error A18 - WATER TEMP ALARM',
    state: StoveStateStatus.ERROR,
  },
  {
    id: 61,
    description: 'Error A19 - FAULTY WATER PROBE',
    state: StoveStateStatus.ERROR,
  },
  {
    id: 62,
    description: 'Error A20 - FAILURE OF AUXILIARY PROBE',
    state: StoveStateStatus.ERROR,
  },
  {
    id: 63,
    description: 'Error A21 - PRESSURE SWITCH ALARM',
    state: StoveStateStatus.ERROR,
  },
  {
    id: 64,
    description: 'Error A22 - ROOM PROBE FAULT',
    state: StoveStateStatus.ERROR,
  },
  {
    id: 65,
    description: 'Error A23 - BRAZIL CLOSING FAULT',
    state: StoveStateStatus.ERROR,
  },
  {
    id: 66,
    description: 'Error A12 - MOTOR REDUCER CONTROLLER FAILURE',
    state: StoveStateStatus.ERROR,
  },
  {
    id: 67,
    description: 'Error A17 - ENDLESS SCREW JAM',
    state: StoveStateStatus.ERROR,
  },
  {
    id: 69,
    description: 'WAITING FOR SECURITY ALARMS',
    state: StoveStateStatus.ERROR,
  },
];

export enum MaestroType {
  int,
  float,
  string,
  state,
  fan,
  boolean,
}

export interface MaestroData {
  state: MczStoveState;
}

interface MaestroInfo {
  type: MaestroType;
  label: string;
  description: string;
}

export const MaestroInformation: Record<number, MaestroInfo> = {
  0: {
    type: MaestroType.int,
    label: 'messageType',
    description: 'Message Type',
  },
  1: {
    type: MaestroType.state,
    label: 'stoveStatus',
    description: 'StoveEntity State',
  },
  2: {
    type: MaestroType.fan,
    label: 'fanAmbienceState',
    description: 'Ambience Fan State',
  },
  3: {
    type: MaestroType.fan,
    label: 'fanDucted1State',
    description: 'Ducted Fan 1 State',
  },
  4: {
    type: MaestroType.fan,
    label: 'fanDucted2State',
    description: 'Ducted Fan 2 State',
  },
  5: {
    type: MaestroType.int,
    label: 'fumeTemperature',
    description: 'Fume Temperature',
  },
  6: {
    type: MaestroType.float,
    label: 'ambientTemperature',
    description: 'Ambient Temperature',
  },
  7: {
    type: MaestroType.float,
    label: 'pufferTemperature',
    description: 'Puffer Temperature',
  },
  8: {
    type: MaestroType.float,
    label: 'boilerTemperature',
    description: 'Boiler Temperature',
  },
  9: {
    type: MaestroType.float,
    label: 'ntc3Temperature',
    description: 'NTC3 Temperature',
  },
  10: {
    type: MaestroType.boolean,
    label: 'ignitionState',
    description: 'Ignition State',
  },
  11: { type: MaestroType.int, label: 'activeSet', description: 'Active Set' },
  12: {
    type: MaestroType.int,
    label: 'fanFumeRPM',
    description: 'Fan Fume RPM',
  },
  13: {
    type: MaestroType.int,
    label: 'feederScrewSetRPM',
    description: 'Feeder Screw Set RPM',
  },
  14: {
    type: MaestroType.int,
    label: 'feederScrewLiveRPM',
    description: 'Feeder Screw Live RPM',
  },
  17: {
    type: MaestroType.int,
    label: 'brazierState',
    description: 'Brazier State',
  },
  18: {
    type: MaestroType.boolean,
    label: 'profileState',
    description: 'Profile State',
  },
  19: {
    type: MaestroType.int,
    label: 'unknown19',
    description: 'Unknown 19',
  },
  20: {
    type: MaestroType.boolean,
    label: 'activeModeState',
    description: 'Active Mode State',
  },
  21: {
    type: MaestroType.int,
    label: 'activeLive',
    description: 'Active Live',
  },
  22: {
    type: MaestroType.boolean,
    label: 'regulationMode',
    description: 'Regulation Mode',
  },
  23: { type: MaestroType.boolean, label: 'ecoMode', description: 'ECO Mode' },
  24: {
    type: MaestroType.boolean,
    label: 'silenceMode',
    description: 'Silence Mode',
  },
  25: {
    type: MaestroType.boolean,
    label: 'chronometerThermostatMode',
    description: 'Chronometer thermostat Mode',
  },
  26: {
    type: MaestroType.float,
    label: 'setTemperature',
    description: 'Set Temperature',
  },
  27: {
    type: MaestroType.float,
    label: 'boilerTemperature',
    description: 'Boiler Temperature',
  },
  28: {
    type: MaestroType.float,
    label: 'motherboardTemperature',
    description: 'Motherboard Temperature',
  },
  29: {
    type: MaestroType.int,
    label: 'activePower',
    description: 'Active Power',
  },
  30: {
    type: MaestroType.int,
    label: 'unknown30',
    description: 'Unknown 30',
  },
  31: {
    type: MaestroType.boolean,
    label: 'unknown31',
    description: 'Unknown 31',
  },
  32: {
    type: MaestroType.int,
    label: 'stoveHour',
    description: 'StoveEntity Hour',
  },
  33: {
    type: MaestroType.int,
    label: 'stoveMinute',
    description: 'StoveEntity Minute',
  },
  34: {
    type: MaestroType.int,
    label: 'stoveDay',
    description: 'StoveEntity Day',
  },
  35: {
    type: MaestroType.int,
    label: 'stoveMonth',
    description: 'StoveEntity Month',
  },
  36: {
    type: MaestroType.int,
    label: 'stoveYear',
    description: 'StoveEntity Year',
  },
  37: {
    type: MaestroType.int,
    label: 'totalOperating',
    description: 'Total Operating  in seconds',
  },
  38: {
    type: MaestroType.int,
    label: 'power1Operating',
    description: 'Power 1 Operating in seconds',
  },
  39: {
    type: MaestroType.int,
    label: 'power2Operating',
    description: 'Power 2 Operating in seconds',
  },
  40: {
    type: MaestroType.int,
    label: 'power3Operating',
    description: 'Power 3 Operating in seconds',
  },
  41: {
    type: MaestroType.int,
    label: 'power4Operating',
    description: 'Power 4 Operating in seconds',
  },
  42: {
    type: MaestroType.int,
    label: 'power5Operating',
    description: 'Power 5 Operating in seconds',
  },
  43: {
    type: MaestroType.int,
    label: 'maintenanceHours',
    description: 'Maintenance Hours',
  },
  44: {
    type: MaestroType.int,
    label: 'shutdownMinutes',
    description: 'Shutdown Minutes',
  },
  45: {
    type: MaestroType.int,
    label: 'ignitionCount',
    description: 'Ignition Count',
  },
  46: {
    type: MaestroType.int,
    label: 'unknown46',
    description: 'Unknown 46',
  },
  47: {
    type: MaestroType.boolean,
    label: 'pelletSensor',
    description: 'Pellet Sensor',
  },
  48: {
    type: MaestroType.boolean,
    label: 'soundEffect',
    description: 'Sound Effect',
  },
  49: {
    type: MaestroType.boolean,
    label: 'soundEffectState',
    description: 'Sound Effect State',
  },
  50: {
    type: MaestroType.boolean,
    label: 'sleepMode',
    description: 'Sleep Mode',
  },
  51: {
    type: MaestroType.boolean,
    label: 'operationMode',
    description: 'Operation Mode',
  },
  52: {
    type: MaestroType.float,
    label: 'wifiSensorTemperature1',
    description: 'Wifi Sensor Temperature 1',
  },
  53: {
    type: MaestroType.float,
    label: 'wifiSensorTemperature2',
    description: 'WiFi Sensor Temperature 2',
  },
  54: {
    type: MaestroType.float,
    label: 'wifiSensorTemperature3',
    description: 'WiFi Sensor Temperature 3',
  },
  56: { type: MaestroType.int, label: 'setPuffer', description: 'Set Puffer' },
  57: { type: MaestroType.int, label: 'setBoiler', description: 'Set Boiler' },
  58: { type: MaestroType.int, label: 'setHealth', description: 'Set Health' },
  59: {
    type: MaestroType.float,
    label: 'returnTemperature',
    description: 'Return Temperature',
  },
  60: {
    type: MaestroType.boolean,
    label: 'antifreeze',
    description: 'Antifreeze State',
  },
};

export type MaestroObject = {
  stoveStatus: MczStoveState;
  fanAmbienceState: MczFanState;
  fanDucted1State: MczFanState;
  fanDucted2State: MczFanState;
  fumeTemperature: number;
  ambientTemperature: number;
  pufferTemperature: number;
  boilerTemperature: number;
  ntc3Temperature: number;
  ignitionState: boolean;
  activeSet: number;
  fanFumeRPM: number;
  feederScrewSetRPM: number;
  feederScrewLiveRPM: number;
  brazierState: boolean;
  profileState: boolean;
  activeModeState: boolean;
  activeLive: number;
  regulationMode: boolean;
  ecoMode: boolean;
  silenceMode: boolean;
  chronometerThermostatMode: boolean;
  setTemperature: number;
  motherboardTemperature: number;
  activePower: number;
  stoveHour: number;
  stoveMinute: number;
  stoveDay: number;
  stoveMonth: number;
  stoveYear: number;
  totalOperating: number;
  power1Operating: number;
  power2Operating: number;
  power3Operating: number;
  power4Operating: number;
  power5Operating: number;
  maintenanceHours: number;
  shutdownMinutes: number;
  ignitionCount: number;
  pelletSensor: boolean;
  soundEffect: boolean;
  soundEffectState: boolean;
  sleepMode: boolean;
  operationMode: boolean;
  wifiSensorTemperature1: number;
  wifiSensorTemperature2: number;
  wifiSensorTemperature3: number;
  setPuffer: number;
  setBoiler: number;
  setHealth: number;
  returnTemperature: number;
  antifreeze: boolean;
};
