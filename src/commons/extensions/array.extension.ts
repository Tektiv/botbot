import { MathUtils } from '@utils/math.util';

export {};

declare global {
  interface Array<T> {
    /**
     * Returns the first element of an array.
     * If it is empty, returns undefined.
     */
    get first(): T;

    /**
     * Returns the last element of an array.
     * If it is empty, returns undefined.
     */
    get last(): T;

    /**
     * Picks a random element of an array.
     * If it is empty, returns undefined.
     */
    pickOne(): T;

    /**
     * Picks a random element of an array.
     * @param weights An array of weights for the probabilities of each occurrence.
     */
    pickOneUsingWeight(weights: number[]): T;

    /**
     * Removes duplicate elements by keeping only its first occurrence.
     * @example [1, 2, 1, 3, 1, 1, 4] => [1, 2, 3, 4]
     */
    removeDuplicates(): T[];
  }
}

(Array.prototype as any).__defineGetter__('first', function <T>(this: T[]) {
  return this[0];
});

(Array.prototype as any).__defineGetter__('last', function <T>(this: T[]) {
  return this[this.length - 1];
});

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
