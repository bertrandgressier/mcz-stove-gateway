interface SensorConfig {
  device: {
    identifiers: string[];
    name: string;
    manufacturer: string;
  };
  name: string;
  unique_id: string;
  state_topic: string;
  availability_topic: string;
  unit_of_measurement: string;
  device_class: string;
  value_template: string;
}

type deviceClass =
  | 'temperature'
  | 'speed'
  | 'durationSecond'
  | 'durationHour'
  | 'heat';

interface HASensor {
  name: string;
  valueTemplate: string;
  deviceClass: deviceClass;
}

export const sensors: HASensor[] = [
  // {
  //   name: 'Activated',
  //   valueTemplate: 'activated',
  //   deviceClass: 'heat',
  // },
  {
    name: 'Smoke Temperature',
    valueTemplate: 'smokesTemperature',
    deviceClass: 'temperature',
  },
  {
    name: 'Active Temperature',
    valueTemplate: 'activeTemperature',
    deviceClass: 'temperature',
  },
  {
    name: 'RPM Fumes',
    valueTemplate: 'rpmFumes',
    deviceClass: 'speed',
  },
  {
    name: 'RPM Feeding Screw',
    valueTemplate: 'rpmFeedingScrew',
    deviceClass: 'speed',
  },
  {
    name: 'Operating Power 1',
    valueTemplate: 'powerOperating.power1Operating',
    deviceClass: 'durationSecond',
  },
  {
    name: 'Operating Power 2',
    valueTemplate: 'powerOperating.power2Operating',
    deviceClass: 'durationSecond',
  },
  {
    name: 'Operating Power 3',
    valueTemplate: 'powerOperating.power3Operating',
    deviceClass: 'durationSecond',
  },
  {
    name: 'Operating Power 4',
    valueTemplate: 'powerOperating.power4Operating',
    deviceClass: 'durationSecond',
  },
  {
    name: 'Operating Power 5',
    valueTemplate: 'powerOperating.power5Operating',
    deviceClass: 'durationSecond',
  },
  {
    name: 'Hours Service',
    valueTemplate: 'powerOperating.hoursService',
    deviceClass: 'durationHour',
  },
];

export const setupSensorConfig = (
  stoveId: string,
  name: string,
  valueTemplate: string,
  deviceClass: deviceClass,
): SensorConfig => {
  //snake case of name
  const unique_id = `mcz_${stoveId}_${name.replace(/\s+/g, '_').toLowerCase()}`;
  return {
    device: {
      identifiers: [`mcz_${stoveId}`],
      name: 'MCZ Stove',
      manufacturer: 'MCZ',
    },
    name: name,
    unique_id,
    state_topic: `MczStove/${stoveId}/stoveData`,
    availability_topic: `MczStove/${stoveId}/connected`,
    unit_of_measurement:
      deviceClass === 'temperature'
        ? '°C'
        : deviceClass === 'speed'
          ? 'RPM'
          : deviceClass === 'durationSecond'
            ? 's'
            : deviceClass === 'durationHour'
              ? 'h'
              : '',
    device_class:
      deviceClass === 'durationSecond' || deviceClass === 'durationHour'
        ? 'duration'
        : deviceClass,
    value_template: `{{ value_json.${valueTemplate} }}`,
  };
};
