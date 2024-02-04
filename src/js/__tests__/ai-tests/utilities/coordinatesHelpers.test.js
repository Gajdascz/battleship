import { describe, expect, test } from 'vitest';

import {
  sumCoordinates,
  getOrientationDirections,
  getDelta,
  getPerpendicularCoordinates
} from '../../../logic/ai/utilities/coordinatesHelpers';

import { DIRECTIONS } from '../../../utility/constants';

describe('Coordinates Helper Functions', () => {
  test('sumCoordinates - Should correctly add two coordinate vectors together', () => {
    expect(sumCoordinates([0, 0], [1, 1])).toEqual([1, 1]);
    expect(sumCoordinates([6, 3], [4, 7])).toEqual([10, 10]);
    expect(sumCoordinates([-5, -8], [5, 8])).toEqual([0, 0]);
  });

  test('getOrientationDirections - Should return directions relevant to provided orientation', () => {
    const vertical = getOrientationDirections('vertical');
    expect(vertical.up).toEqual(DIRECTIONS.UP);
    expect(vertical.down).toEqual(DIRECTIONS.DOWN);
    const horizontal = getOrientationDirections('horizontal');
    expect(horizontal.left).toEqual(DIRECTIONS.LEFT);
    expect(horizontal.right).toEqual(DIRECTIONS.RIGHT);
  });

  test('getDelta - Should return the difference between two coordinates', () => {
    expect(getDelta([5, 5], [5, 5])).toEqual([0, 0]);
    expect(getDelta([3, 2], [-1, 0])).toEqual([-4, -2]);
    expect(getDelta([3, 2], [-1, 0], true)).toEqual([-1, -1]);
    expect(getDelta([6, 5], [4, 5], true)).toEqual([-1, 0]);
    expect(getDelta([8, 0], [9, 0], true)).toEqual([1, 0]);
  });

  test('getPerpendicularCoordinates - Should return coordinates perpendicular to given origin and orientation', () => {
    expect(getPerpendicularCoordinates([5, 5], 'vertical')).toEqual([
      [5, 4],
      [5, 6]
    ]);
    expect(getPerpendicularCoordinates([5, 5], 'horizontal')).toEqual([
      [4, 5],
      [6, 5]
    ]);
    expect(getPerpendicularCoordinates([0, 0], 'vertical')).toEqual([
      [0, -1],
      [0, 1]
    ]);
    expect(getPerpendicularCoordinates([0, 0], 'horizontal')).toEqual([
      [-1, 0],
      [1, 0]
    ]);
  });
});
