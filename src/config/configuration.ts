import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { AppConfig, configSchema } from './configSchema';

const YAML_CONFIG_FILENAME = '../../config.yml';

const logger = new Logger('configuration');

const parseYaml = () => {
  try {
    return yaml.load(
      readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8'),
    ) as Record<string, any>;
  } catch (e) {
    logger.error(`Error parsing YAML config file: ${e}`);
    throw e;
  }
};

export default registerAs('app', (): AppConfig => {
  const config = parseYaml();

  const { error, value } = configSchema.validate(config, { abortEarly: false });

  if (error) {
    logger.error('Configuration validation error:', error.details);
    throw new Error('Invalid configuration');
  }

  return value;
});

// export default () => {
//   return yaml.load(
//     readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8'),
//   ) as Record<string, any>;
// };
