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
}
