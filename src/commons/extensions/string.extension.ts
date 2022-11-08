export {};

declare global {
  interface String {
    map(fct: (letter: string, index?: number, string?: string[]) => unknown): string;
    remove(...letters: string[]): string;
    removeTwinLetters(this: string): string;
    capitalize(this: string, all?: boolean): string;
  }
}

String.prototype.map = function (
  this: string,
  fct: (letter: string, index?: number, string?: string[]) => unknown,
): string {
  return this.split('').map(fct).join('');
};

String.prototype.remove = function (this: string, ...characters: string[]): string {
  let str = this;
  characters.forEach((character) => (str = str.replace(new RegExp(character, 'g'), '')));
  return str;
};

String.prototype.removeTwinLetters = function (this: string): string {
  return this.map((letter, index, array) => (index === 0 || array![index ?? 0 - 1] !== letter ? letter : ''));
};

String.prototype.capitalize = function (this: string, all = false): string {
  if (all) {
    return this.replace(/\b\w/, (l) => l.toUpperCase());
  }
  return this.replace(/\b\w/g, (l) => l.toUpperCase());
};