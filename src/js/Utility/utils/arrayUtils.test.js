import { describe, expect, it, beforeEach } from 'vitest';
import { popRandom, popFrom, removeDuplicates, getRandom, getFrom, popFirst } from './arrayUtils';
const areCoordinatesEqual = (coordinatesOne, coordinatesTwo) => {
  const [x1, y1] = coordinatesOne;
  const [x2, y2] = coordinatesTwo;
  return x1 === x2 && y1 === y2;
};

let array = null;
const checkArray = (check) =>
  array.findIndex((coordinates) => areCoordinatesEqual(check, coordinates));

beforeEach(() => {
  array = [
    [0, 0],
    [5, 5],
    [9, 9],
    [100, 100],
    [42, 42]
  ];
});

describe('Array Utils', () => {
  it('popRandom should retrieve and remove an item from the array randomly', () => {
    const random = popRandom(array);
    expect(checkArray(random)).toBe(-1);
  });
  it('popFrom should retrieve and remove an item from the array at the specified index', () => {
    expect(popFrom(array, 3)).toEqual([100, 100]);
    expect(checkArray([100, 100])).toBe(-1);
  });
  it('popFirst should retrieve and remove the first element from the array', () => {
    expect(popFirst(array)).toEqual([0, 0]);
    expect(checkArray([0, 0])).toBe(-1);
  });
  it('getRandom should retrieve an item randomly from the unmodified array', () => {
    const random = getRandom(array);
    expect(checkArray(random)).toBeGreaterThanOrEqual(0);
  });
  it('getFrom should retrieve an item from the unmodified array at a specified index', () => {
    const fromIndexFour = getFrom(array, 4);
    expect(checkArray(fromIndexFour)).toBe(4);
  });

  it('removeDuplicates should remove duplicate coordinate pairs and return a clean array', () => {
    array.push([0, 0], [33, 33], [5, 9], [42, 42], [100, 100]);
    const cleanArray = removeDuplicates(array);
    expect(cleanArray).toEqual([
      [0, 0],
      [5, 5],
      [9, 9],
      [100, 100],
      [42, 42],
      [33, 33],
      [5, 9]
    ]);
  });
});
