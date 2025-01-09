export enum StovePower {
  OFF = 0,
  POWER_1 = 1,
  POWER_2 = 2,
  POWER_3 = 3,
  POWER_4 = 4,
  POWER_5 = 5,
}

export enum FanMode {
  OFF = 0,
  POWER_1 = 1,
  POWER_2 = 2,
  POWER_3 = 3,
  POWER_4 = 4,
  POWER_5 = 5,
  AUTO = 6,
}

export class PowerOperating {
  hoursService: number;
  power1Operating: number;
  power2Operating: number;
  power3Operating: number;
  power4Operating: number;
  power5Operating: number;
}

export enum StoveStatus {
  OFF,
  IDLE,
  ON,
  ERROR,
}

export class StoveState {
  statusId: number;
  statusDescription: string;
  activePower: StovePower;
  fanMode: number;
  regulationMode: boolean;
  activeMode: boolean;
  activated: StoveStatus;
  ambientTemperature: number;
  targetTemperature: number;
  smokesTemperature: number; // fumeTemperature
  activeTemperature: number;
  motherBoardTemperature: number;
  rpmFumes: number; // fanFumeRPM
  rpmFeedingScrew: number;
  ecoStop: boolean;
  autoMode: boolean;
  sleepMode: boolean;

  powerOperating: PowerOperating;
  timestamp: number;
}
