export class ArrayUtils {
  static generateNumbersFromXToY(x: number, y: number, max?: number, min = 0): number[] {
    if (y < x) {
      if (max == null || max < x) {
        return [];
      }

      return [...this.generateNumbersFromXToY(x, max), ...this.generateNumbersFromXToY(min, y)];
    }

    return [...Array(y - x + 1)].map((_, i) => i + x);
  }
}
