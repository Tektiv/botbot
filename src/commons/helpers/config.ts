import { Environment } from './environment';

export class Configuration {
  static credits = Environment.get('CREDITS_NAME').or('¢').value;
}
