import './string.extension';

describe('StringExtension', () => {
  describe('map', () => {
    it('should call the mapping function for each character of a string', () => {
      const str = 'Hello world!';
      const splitString = str.split('');
      const fn = jest.fn((letter) => letter);

      expect(str.map(fn)).toBe(str);
      expect(fn).toHaveBeenCalledTimes(str.length);
      expect(fn).toHaveBeenNthCalledWith(1, 'H', 0, splitString);
      expect(fn).toHaveBeenNthCalledWith(4, 'l', 3, splitString);
      expect(fn).toHaveBeenNthCalledWith(6, ' ', 5, splitString);
      expect(fn).toHaveBeenNthCalledWith(12, '!', 11, splitString);
    });
  });

  describe('remove', () => {
    it('should remove all occurrences of a specified letter in a string', () => {
      const str = 'Good geode!';

      expect(str.remove('e')).toBe('Good god!');
    });

    it('should remove all occurrences of a substring in a string', () => {
      const str = 'I thought I would give it thoughts';

      expect(str.remove(' thought')).toBe('I I would give its');
    });

    it('should remove all occurrences sequentially, even if new combinations appear', () => {
      const str = 'bafoobarfoor';

      expect(str.remove('bar', 'foofoo')).toBe('bar');
    });
  });

  describe('removeTwinLetters', () => {
    it('should remove the second consecutive letter of a string that matches the previous one from left to right.', () => {
      const str = 'Heellooo Dolly!!';

      expect(str.removeTwinLetters()).toBe('Helo Doly!');
    });
  });

  describe('capitalize', () => {
    it('should capitalize the first letter of the string by default', () => {
      const str = 'what a beautiful world!';

      expect(str.capitalize()).toBe('What a beautiful world!');
    });

    it('should capitalize the first letter of each word if eachWord is true', () => {
      const str = 'what a beautiful world!';

      expect(str.capitalize(true)).toBe('What A Beautiful World!');
    });
  });
});
