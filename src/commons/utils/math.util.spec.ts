import { MathUtils } from '@utils/math.util';

describe('MathUtils', () => {
  describe('random', () => {
    it('should generate a random integer in a specified interval', () => {
      const min = 0;
      const max = 100;
      const n = MathUtils.random(min, max);

      expect(Math.round(n)).toBe(n);
      expect(n).toBeGreaterThanOrEqual(min);
      expect(n).toBeLessThanOrEqual(max);
    });
  });
});
