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
  unit_of_measurement?: string;
  device_class?: string;
  icon?: string;
  value_template: string;
}

interface SensorBinaryConfig {
  device: {
    identifiers: string[];
    name: string;
    manufacturer: string;
  };
  name: string;
  platform: string;
  unique_id: string;
  state_topic: string;
  availability_topic: string;
  value_template: string;
  payload_on?: string;
  payload_off?: string;
  state_on?: string;
  state_off?: string;
}

interface SwitchConfig {
  device: {
    identifiers: string[];
    name: string;
    manufacturer: string;
  };
  name: string;
  unique_id: string;
  state_topic: string;
  command_topic: string;
  availability_topic: string;
  payload_on: string;
  payload_off: string;
  state_on: string;
  state_off: string;
  value_template?: string; // Added for extracting state from JSON (though not used by standard MQTT switch)
  optimistic?: boolean; // Consider adding if state updates are slow/unreliable
  retain?: boolean; // Usually false for commands
  icon?: string;
}

interface HABinarySensor {
  name: string;
  valueTemplate: string;
  removed?: boolean;
}

type deviceClass = 'temperature' | 'speed' | 'durationSecond' | 'durationHour';

interface HASensor {
  name: string;
  valueTemplate: string;
  deviceClass?: deviceClass;
  icon?: string;
}

export const sensors: HASensor[] = [
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
  {
    name: 'Status Id',
    valueTemplate: 'statusId',
    deviceClass: null,
    icon: 'mdi:numeric',
  },
  {
    name: 'Status description',
    valueTemplate: 'statusDescription',
    deviceClass: null,
    icon: 'mdi:fireplace',
  },
  {
    name: 'Activated',
    valueTemplate: 'activated',
    deviceClass: null,
    icon: 'mdi:string',
  },
];

export const binarySensors: HABinarySensor[] = [
  {
    name: 'Eco Stop',
    valueTemplate: 'ecoStop', // This will be used for the state of the switch
  },
  {
    name: 'Auto Mode',
    valueTemplate: 'autoMode',
  },
  {
    name: 'Sleep Mode',
    valueTemplate: 'sleepMode',
  },
  {
    name: 'Regulation Mode',
    valueTemplate: 'regulationMode',
  },
  {
    name: 'Active Mode',
    valueTemplate: 'activeMode',
  },
  {
    name: 'Activated',
    valueTemplate: 'activated',
    removed: true,
  },
];

export const setupClimateConfig = (stoveId: string) => {
  const unique_id = `mcz_${stoveId}_climate`;

  return {
    device: {
      identifiers: [`mcz_${stoveId}`],
      name: 'MCZ Stove',
      manufacturer: 'MCZ',
    },
    name: 'MCZ Stove Climate',
    unique_id,
    availability_topic: `MczStove/${stoveId}/connected`,
    modes: ['off', 'heat'],
    action_topic: `MczStove/${stoveId}/stoveData`,
    action_template: '{{ value_json.action }}',
    mode_state_topic: `MczStove/${stoveId}/stoveData`,
    mode_state_template: '{{ value_json.mode_state}}',
    mode_command_topic: `MczStove/${stoveId}/command/power`,
    mode_command_template: `{% if value == 'heat' %}ON{% elif value == 'off' %}OFF{% endif %}`,
    current_temperature_topic: `MczStove/${stoveId}/stoveData`,
    current_temperature_template: '{{ value_json.ambientTemperature }}',
    temperature_state_topic: `MczStove/${stoveId}/stoveData`,
    temperature_state_template: '{{ value_json.targetTemperature }}',
    temperature_unit: 'C',
    temp_step: 0.5,
    precision: 0.5,
    min_temp: 15,
    max_temp: 25,
    temperature_command_topic: `MczStove/${stoveId}/command/target_temperature`,
    optimistic: true, // Assume commands work immediately for better UX
  };
};

export const setupBinarySensorConfig = (
  stoveId: string,
  name: string,
  valueTemplate: string,
): SensorBinaryConfig => {
  //snake case of name
  const unique_id = `mcz_${stoveId}_${name.replace(/\s+/g, '_').toLowerCase()}`;
  return {
    device: {
      identifiers: [`mcz_${stoveId}`],
      name: 'MCZ Stove',
      manufacturer: 'MCZ',
    },
    name: name,
    platform: 'binary_sensor',
    unique_id,
    state_topic: `MczStove/${stoveId}/stoveData`,
    availability_topic: `MczStove/${stoveId}/connected`,
    value_template: `{{ value_json.${valueTemplate} }}`,
  };
};

export const setupSensorConfig = (
  stoveId: string,
  name: string,
  valueTemplate: string,
  deviceClass?: deviceClass,
  icon?: string,
): SensorConfig => {
  //snake case of name
  const unique_id = `mcz_${stoveId}_${name.replace(/\s+/g, '_').toLowerCase()}`;

  if (deviceClass !== null) {
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
  } else {
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
      value_template: `{{ value_json.${valueTemplate} }}`,
      icon,
    };
  }
};

export const setupSwitchConfig = (
  stoveId: string,
  name: string,
  stateValueTemplate: string, // Path to the boolean value in stoveData JSON
  commandSubTopic: string, // e.g., 'eco_stop'
  icon?: string,
): SwitchConfig => {
  const unique_id = `mcz_${stoveId}_${name.replace(/\s+/g, '_').toLowerCase()}`;
  const baseTopic = `MczStove/${stoveId}`;

  return {
    device: {
      identifiers: [`mcz_${stoveId}`],
      name: 'MCZ Stove',
      manufacturer: 'MCZ',
    },
    name: name,
    unique_id,
    state_topic: `${baseTopic}/stoveData`, // State comes from the main data topic
    command_topic: `${baseTopic}/command/${commandSubTopic}`,
    availability_topic: `${baseTopic}/connected`,
    payload_on: 'ON',
    payload_off: 'OFF',
    state_on: 'true', // HA will compare the output of value_template to these
    state_off: 'false',
    value_template: `{{ value_json.${stateValueTemplate} | lower }}`, // Extract boolean, convert to lowercase string 'true'/'false'
    optimistic: true, // Assume command works immediately for better UX
    icon: icon || 'mdi:leaf-eco', // Default icon for Eco mode
  };
};
