export {};

declare global {
  interface String {
    /**
     * Calls a defined callback function on each character of a string, and returns a string that contains the results.
     * @param fct A function that accepts up to three arguments. The map method calls the fct function one time for each char in the string.
     */
    map(fct: (letter: string, index: number, string: string[]) => unknown): string;

    /**
     * Removes a set of substrings from a string.
     * @param letters The set of substrings to remove.
     */
    remove(...letters: string[]): string;

    /**
     * Removes the second consecutive letter of a string that matches the previous one from left to right.
     * @example "Heellooo Dolly!!" => "Helo Doly!"
     */
    removeTwinLetters(this: string): string;

    /**
     * Capitalizes the first letter of the string.
     * @param eachWord If true, capitalizes the first letter of each word.
     */
    capitalize(this: string, eachWord?: boolean): string;
  }
}

String.prototype.map = function (
  this: string,
  fct: (letter: string, index: number, string: string[]) => unknown,
): string {
  return this.split('').map(fct).join('');
};

String.prototype.remove = function (this: string, ...characters: string[]): string {
  let str = this;
  characters.forEach((character) => (str = str.replace(new RegExp(character, 'g'), '')));
  return str;
};

String.prototype.removeTwinLetters = function (this: string): string {
  return this.map((letter, index, array) => (index === 0 || array[index - 1] !== letter ? letter : ''));
};

String.prototype.capitalize = function (this: string, eachWord = false): string {
  if (eachWord) {
    return this.replace(/\b\w/g, (l) => l.toUpperCase());
  }
  return this.replace(/\b\w/, (l) => l.toUpperCase());
};
