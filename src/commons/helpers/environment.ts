import { env } from 'process';

export class Environment<T> {
  private key!: string;
  private _value: any;

  static get<T = string>(key: string) {
    const envVar = new Environment<T>();

    envVar.key = key;
    envVar._value = env[key];

    return envVar;
  }

  or(value: T) {
    if (this._value == null) {
      this._value = value;
    }
    return this;
  }

  get value(): T {
    return this._value;
  }
}
