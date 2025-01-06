import * as Joi from 'joi';

export interface MczWsConfig {
  url: string;
}

export interface StoveConfig {
  serialNumber: string;
  macAddress: string;
}

export interface MqttConfig {
  url: string;
  username: string;
  password: string;
  mqttTopicPath: string;
}

export interface InternalConfig {
  debug: boolean;
}

export interface AppConfig {
  setup: InternalConfig;
  mqtt: MqttConfig;
  ws: MczWsConfig;
  stoves: StoveConfig[];
}

export const configSchema = Joi.object<AppConfig>({
  setup: Joi.object({
    debug: Joi.boolean().required(),
  }).required(),
  mqtt: Joi.object<MqttConfig>({
    url: Joi.string().uri().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    mqttTopicPath: Joi.string().required(),
  }).required(),
  ws: Joi.object<MczWsConfig>({
    url: Joi.string().uri().required(),
  }).required(),
  stoves: Joi.array()
    .items(
      Joi.object<StoveConfig>({
        serialNumber: Joi.string().required(),
        macAddress: Joi.string().required(),
      }),
    )
    .required(),
});
