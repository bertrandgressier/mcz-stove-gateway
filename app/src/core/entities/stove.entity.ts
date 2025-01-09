import { ApiProperty } from '@nestjs/swagger';
import { PowerOperating } from './stove-state.entity';

interface PowerConsumption {
  rpmSpeed: number;
  consumption: number;
}

export const DEFAULT_POWER_RPM = [140, 246, 322, 399, 405];
export const DEFAULT_CALIBRATION_CONSUMPTION = 0.36;
export const DEFAULT_CALIBRATION_RPM = 1500;

export class StoveEntity {
  id: string;
  macAddress: string;

  @ApiProperty({
    type: 'object',
    additionalProperties: {
      type: 'object',
      properties: {
        rpmSpeed: { type: 'number' },
        consumption: { type: 'number' },
      },
    },
  })
  private powerRPMSpeed: Map<number, PowerConsumption> = new Map();
  private calibrationRPM: number;
  private calibrationConsumption: number;

  constructor(
    id: string,
    macAddress: string,
    powerRPMSpeedConfig: number[] = DEFAULT_POWER_RPM,
    powerConsumptionConfig: number = DEFAULT_CALIBRATION_CONSUMPTION,
    calibrationRPMConfig: number = DEFAULT_CALIBRATION_RPM,
  ) {
    this.id = id;
    this.macAddress = macAddress;

    this.calibrationRPM = calibrationRPMConfig;
    this.calibrationConsumption = powerConsumptionConfig; // consumption at 900 rpm during 1 minute in kilogram

    powerRPMSpeedConfig.forEach((rpmSpeed, index) => {
      const consumption =
        ((this.calibrationConsumption / this.calibrationRPM) * rpmSpeed) / 60;
      this.powerRPMSpeed.set(index + 1, {
        rpmSpeed,
        consumption,
      });
    });
  }

  calculateConsumption(
    previousPower: PowerOperating,
    newPower: PowerOperating,
  ): number {
    let consumption = 0;

    for (let i = 1; i <= 5; i++) {
      const seconds =
        newPower[`power${i}Operating`] - previousPower[`power${i}Operating`];
      consumption += this.powerRPMSpeed.get(i).consumption * seconds;
    }

    return consumption;
  }
}
