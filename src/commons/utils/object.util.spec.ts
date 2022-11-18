import { ObjectUtils } from '@utils/object.util';

describe('ObjectUtils', () => {
  describe('fromEntries', () => {
    it('should create an object from a list of key/value pairs', () => {
      const pairs = [
        ['a', 'b'],
        ['c', 'd'],
      ] as Array<[string, string]>;
      const expected = {
        a: 'b',
        c: 'd',
      };

      expect(ObjectUtils.fromEntries(pairs)).toEqual(expected);
    });

    it('should convert numeric keys to string', () => {
      const pairs = [
        [1, 2],
        [3, 4],
      ] as Array<[number, number]>;
      const expected = {
        '1': 2,
        '3': 4,
      };

      expect(ObjectUtils.fromEntries(pairs)).toEqual(expected);
    });
  });
});
