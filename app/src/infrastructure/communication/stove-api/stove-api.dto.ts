export class StoveStateDto {
  activated: boolean;
  activeTemperature: number;
  autoMode: boolean;
  ecoStop: boolean;
  fanMode: number;
  sleepMode: boolean;
  motherBoardTemperature: number;
  activePower: number;
  rpmFeedingScrew: number;
  rpmFumes: number;
  smokesTemperature: number;
  ambientTemperature: number;
  targetTemperature: number;
  regulationMode: boolean;
  activeMode: boolean;
  powerOperating: {
    hoursService: number;
    power1Operating: number;
    power2Operating: number;
    power3Operating: number;
    power4Operating: number;
    power5Operating: number;
  };
}
