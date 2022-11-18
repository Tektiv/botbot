/**
 * A class of utils to manipulate numbers.
 */
export class MathUtils {
  /**
   * Generates a random integer x matching:
   *
   * min <= x <= max
   * @param min
   * @param max
   */
  static random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
