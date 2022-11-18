import { NestedPaths, TypeFromPath } from '../types/nested-path';

/**
 * A class of utils to manipulate objects.
 */
export class ObjectUtils {
  /**
   * Converts an array of key/value pairs to an object.
   * @example [["a", "b"], ["c", "d"]] => { "a": "b", "c": "d" }
   * @param array
   */
  static fromEntries<K extends keyof any, V>(array: Array<[K, V]>): Record<string, V> {
    return array.reduce((obj, [key, value]) => Object.assign(obj, { [key]: value }), {} as Record<K, V>);
  }

  /**
   * Gets the value of a nested property of an object based on its path.
   * @param obj
   * @param path
   * @param defaultValue
   */
  static get<K extends keyof any, V, Path extends NestedPaths<Record<K, V>>>(
    obj: Record<K, V>,
    path?: Path,
    defaultValue: any = undefined,
  ): TypeFromPath<Record<K, V>, Path> {
    if (!path) {
      return (obj as any) || defaultValue;
    }
    return path
      .split('.')
      .reduce((subObject: any, subKey: any) => (subObject ? subObject[subKey] : defaultValue), obj) as any;
  }
}
