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
   */
  static get<K extends keyof any, V, O extends Record<K, V>, Path extends NestedPaths<O>>(
    obj: O,
    path?: Path,
  ): TypeFromPath<O, Path> {
    if (!path) {
      return obj as any;
    }
    return path.split('.').reduce((subObject: any, subKey: any) => subObject[subKey] ?? undefined, obj);
  }
}
