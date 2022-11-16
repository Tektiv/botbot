import "./array.extension";
import { MathUtils } from "@utils/math.util";

describe("ArrayExtension", () => {
  describe("first", () => {
    it("should get the first element of an array", () => {
      const array = [1, 2, 3];

      expect(array.first).toBe(1);
    });

    it("should return undefined if array is empty", () => {
      const array: number[] = [];

      expect(array.first).toBe(undefined);
    });
  });

  describe("last", () => {
    it("should get the last element of an array", () => {
      const array = [1, 2, 3];

      expect(array.last).toBe(3);
    });

    it("should return undefined if array is empty", () => {
      const array: number[] = [];

      expect(array.last).toBe(undefined);
    });
  });

  describe("pickOne", () => {
    it("should return a random element of an array", () => {
      const spy = jest.spyOn(MathUtils, "random");
      spy.mockReturnValueOnce(1);
      spy.mockReturnValueOnce(3);
      spy.mockReturnValueOnce(3);

      const array = [1, 2, 3, 4, 5];

      expect(array.pickOne()).toBe(2);
      expect(array.pickOne()).toBe(4);
      expect(array.pickOne()).toBe(4);
    });

    it("should return undefined if array is empty", () => {
      const spy = jest.spyOn(MathUtils, "random");
      spy.mockReturnValueOnce(0);

      const array: number[] = [];

      expect(array.pickOne()).toBe(undefined);
    });
  });

  describe("pickOneUsingWeights", () => {
    it("should return a random element of an array", () => {
      const spy = jest.spyOn(Math, "random");
      spy.mockReturnValueOnce(0);

      const array = [1, 2, 3, 4, 5];
      const weights = [5, 4, 3, 2, 1];

      expect(array.pickOneUsingWeight(weights)).toBe(1);
    });

    it("should return undefined if array is empty", () => {
      const spy = jest.spyOn(Math, "random");
      spy.mockReturnValueOnce(0);

      const array: number[] = [];
      const weights: number[] = [];

      expect(array.pickOneUsingWeight(weights)).toBe(undefined);
    });
  });

  describe("removeDuplicates", () => {
    it("should remove additional elements of an array that are duplicate", () => {
      const array = [1, 1, 2, 1, 1, 3, 1, 4, 2, 4, 4, 3];
      const expected = [1, 2, 3, 4];

      expect(array.removeDuplicates()).toEqual(expected);
    });
  });
});
