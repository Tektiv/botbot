import { ObjectUtils } from '@utils/object.util';
import { IConfig } from 'assets/config/config.model';
import { NestedPaths, TypeFromPath } from 'commons/types/nested-path';
import { readFileSync } from 'fs';

export class Config {
  static config: IConfig;

  static load() {
    this.config = JSON.parse(readFileSync('src/assets/config/config.json', 'utf8'));
  }

  static get<P extends NestedPaths<IConfig>>(
    path: P,
    defaultValue?: TypeFromPath<IConfig, P>,
  ): TypeFromPath<IConfig, P> {
    return ObjectUtils.get(this.config, path) ?? defaultValue;
  }
}
