import { describe, expect, it } from 'vitest';
import {
  sumCoordinates,
  getOrientationDirections,
  getDelta,
  getPerpendicularCoordinates,
  isAdjacent,
  getRelativeOrientation,
  doCoordinatesMatchOrientation,
  isHorizontal,
  isVertical,
  convertToDisplayFormat,
  convertToInternalFormat
} from './coordinatesUtils';
import { DIRECTIONS, LETTER_AXES } from '../constants/common';

describe('Coordinate Conversions', () => {
  describe('Display Format', () => {
    it('Should format row and column to letter-number.', () => {
      expect(convertToDisplayFormat(0, 1, LETTER_AXES.ROW)).toBe('A1');
    });
    it('Should format row and column to number-letter.', () => {
      expect(convertToDisplayFormat(0, 1, LETTER_AXES.COL)).toBe('0B');
    });
    it('Should handle zero values correctly.', () => {
      expect(convertToDisplayFormat(0, 0, LETTER_AXES.ROW)).toBe('A0');
    });
    it('Should handle zero values correctly.', () => {
      expect(convertToDisplayFormat(0, 0, LETTER_AXES.COL)).toBe('0A');
    });
  });
  describe('Internal Format', () => {
    it('Should convert letter-number coordinate to internal format', () => {
      expect(convertToInternalFormat('A1')).toEqual([0, 1]);
    });
    it('Should throw an error for invalid coordinate format', () => {
      expect(() => convertToInternalFormat('Invalid')).toThrowError();
    });
    it('Should correctly interpret lowercase letters', () => {
      expect(convertToInternalFormat('a1')).toEqual([0, 1]);
    });
    it('Should handle edge coordinates correctly', () => {
      expect(convertToInternalFormat('Z99')).toEqual([25, 99]);
    });
    it('Should correctly interpret coordinates with multi-digit numbers', () => {
      expect(convertToInternalFormat('A10')).toEqual([0, 10]);
    });
    it('Should throw an error for coordinates with no letters', () => {
      expect(() => convertToInternalFormat('123')).toThrowError();
    });
    it('Should throw an error for coordinates with no numbers', () => {
      expect(() => convertToInternalFormat('ABC')).toThrowError();
    });
  });
});
describe('Coordinates Helper Functions', () => {
  it('Should correctly test if two coordinates are aligned horizontally', () => {
    expect(isHorizontal([0, 0], [0, 5])).toBeTruthy();
    expect(isHorizontal([5, 0], [5, 3])).toBeTruthy();
    expect(isHorizontal([0, 0], [5, 0])).toBeFalsy();
    expect(isHorizontal([5, 0], [2, 3])).toBeFalsy();
    expect(isHorizontal([5, 5], [6, 6])).toBeFalsy();
  });
  it('Should correctly test if two coordinates are aligned vertically', () => {
    expect(isVertical([0, 0], [5, 0])).toBeTruthy();
    expect(isVertical([5, 5], [0, 5])).toBeTruthy();
    expect(isVertical([0, 0], [0, 5])).toBeFalsy();
    expect(isVertical([0, 2], [0, 3])).toBeFalsy();
    expect(isVertical([4, 4], [0, 0])).toBeFalsy();
  });
  it('Should correctly add two coordinate vectors together', () => {
    expect(sumCoordinates([0, 0], [1, 1])).toEqual([1, 1]);
    expect(sumCoordinates([6, 3], [4, 7])).toEqual([10, 10]);
    expect(sumCoordinates([-5, -8], [5, 8])).toEqual([0, 0]);
  });
  it('Should return directions relevant to provided orientation', () => {
    const vertical = getOrientationDirections('vertical');
    expect(vertical.up).toEqual(DIRECTIONS.UP);
    expect(vertical.down).toEqual(DIRECTIONS.DOWN);
    const horizontal = getOrientationDirections('horizontal');
    expect(horizontal.left).toEqual(DIRECTIONS.LEFT);
    expect(horizontal.right).toEqual(DIRECTIONS.RIGHT);
  });
  it('Should return the difference between two coordinates', () => {
    expect(getDelta([5, 5], [5, 5])).toEqual([0, 0]);
    expect(getDelta([3, 2], [-1, 0])).toEqual([-4, -2]);
    expect(getDelta([3, 2], [-1, 0], true)).toEqual([-1, -1]);
    expect(getDelta([6, 5], [4, 5], true)).toEqual([-1, 0]);
    expect(getDelta([8, 0], [9, 0], true)).toEqual([1, 0]);
  });
  it('Should return coordinates perpendicular to given origin and orientation', () => {
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
  it('Should check for adjacency between two coordinates', () => {
    expect(isAdjacent([0, 0], [0, 0])).toBe(false);
    expect(isAdjacent([0, 0], [1, 0])).toBe(true);
    expect(isAdjacent([0, 0], [0, 1])).toBe(true);
    expect(isAdjacent([0, 0], [-1, 0])).toBe(true);
    expect(isAdjacent([0, 0], [0, -1])).toBe(true);
    expect(isAdjacent([0, 0], [2, 0])).toBe(false);
    expect(isAdjacent([0, 0], [0, 2])).toBe(false);
    expect(isAdjacent([0, 0], [-2, 0])).toBe(false);
    expect(isAdjacent([0, 0], [0, -2])).toBe(false);
  });
  it('Should return the relative orientation between two coordinate pairs', () => {
    expect(getRelativeOrientation([5, 5], [5, 6])).toEqual('horizontal');
    expect(getRelativeOrientation([5, 5], [6, 5])).toEqual('vertical');
    expect(getRelativeOrientation([5, 5], [6, 6])).toBeNull();
  });
  it('Should correctly validate if two coordinate pairs are aligned in the given orientation', () => {
    expect(doCoordinatesMatchOrientation('vertical', [0, 0], [1, 0])).toBeTruthy();
    expect(doCoordinatesMatchOrientation('vertical', [9, 0], [5, 0])).toBeTruthy();
    expect(doCoordinatesMatchOrientation('horizontal', [0, 0], [0, 3])).toBeTruthy();
    expect(doCoordinatesMatchOrientation('horizontal', [0, 6], [0, 2])).toBeTruthy();
    expect(doCoordinatesMatchOrientation('diagonal', [6, 6], [0, 0])).toBeNull();
  });
});
