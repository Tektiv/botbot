import { Utils } from '@utils/util';
import { IConfig } from 'assets/config/config.model';
import { readFileSync } from 'fs';

export class Config {
  static config: IConfig;

  static load() {
    Config.config = JSON.parse(readFileSync('src/assets/config/config.json', 'utf8'));
  }

  static get<T>(path: string, defaultValue: T): T {
    return Utils.getValue(Config.config, path, defaultValue);
  }
}
