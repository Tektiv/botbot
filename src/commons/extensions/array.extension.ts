import { MathUtils } from '@utils/math.util';

export {};

declare global {
  interface Array<T> {
    pickOne(): T;
    pickOneUsingWeight(wieghts: number[]): T;
    removeDuplicates(): T[];
  }
}

Array.prototype.pickOne = function <T>(this: T[]): T {
  return this[MathUtils.random(0, this.length - 1)];
};

Array.prototype.pickOneUsingWeight = function <T>(this: T[], weights: number[]): T {
  let i;
  for (i = 0; i < weights.length; i++) {
    weights[i] += weights[i - 1] || 0;
  }

  const random = Math.random() * weights[weights.length - 1];
  for (i = 0; i < weights.length; i++) {
    if (weights[i] > random) {
      break;
    }
  }

  return this[i];
};

Array.prototype.removeDuplicates = function <T>(this: T[]): T[] {
  return this.filter((value, index, array) => array.indexOf(value) === index);
};
