type _Object<T = any> = Record<string, T>;

export class ObjectUtils {
  static fromEntries(array: [string | number, any][]): _Object {
    const obj: _Object = {};
    array.forEach(([key, value]) => {
      obj[key] = value;
    });
    return obj;
  }
}
