import { describe, expect, test, beforeEach } from 'vitest';
import { RESULTS } from '../../../utility/constants';
import { canShipFit } from '../../../logic/ai/advancedAI/canShipFit';

import {
  getCellInADirection,
  getValueAt,
  getOpenMovesAround,
  getOpenMovesInADirection,
  getConsecutiveHitsInADirection
} from '../../../logic/ai/utilities/gridHelpers';

import { getOrientationDirections } from '../../../logic/ai/utilities/coordinatesHelpers';
const createGrid = (rows, cols) =>
  Array.from({ length: rows }).map(() => Array.from({ length: cols }).fill(RESULTS.UNEXPLORED));

const wrap = (helper) => {
  helper.resolved = new Set();
  helper.getValueAt = (coordinates) => getValueAt(helper.grid, coordinates);

  helper.getCellInADirection = (coordinates, direction) =>
    getCellInADirection(helper.grid, coordinates, direction);

  helper.getOpenMovesInADirection = (coordinates, direction) =>
    getOpenMovesInADirection(helper.grid, coordinates, direction);

  helper.getOpenMovesAround = (coordinates) => getOpenMovesAround(helper.grid, coordinates);

  helper.getTotalConsecutiveUnresolvedHitsInADirection = (start, direction) => {
    const adjacentUnresolved = [];
    const consecutiveHits = getConsecutiveHitsInADirection(helper.grid, start, direction);
    for (const hit of consecutiveHits) {
      if (!helper.isHitResolved(hit)) adjacentUnresolved.push(hit);
      else break;
    }
    return adjacentUnresolved.length;
  };
  helper.getOrientationDirections = (orientation) => getOrientationDirections(orientation);
  helper.isHitResolved = (hit) => helper.resolved.has(hit?.join(','));
};

const getFnCallObject = (start, smallestShipLength) => ({
  getValueAt: helper.getValueAt,
  getCellInADirection: helper.getCellInADirection,
  getOrientationDirections: helper.getOrientationDirections,
  isHitResolved: helper.isHitResolved,
  start,
  smallestShipLength
});
const helper = { grid: createGrid(10, 10) };
wrap(helper);
beforeEach(() => {
  helper.grid = createGrid(10, 10);
  helper.resolved.clear();
});
const populateRow = (row, result) => row.map((col) => (col = RESULTS[result]));

describe('canShipFit Algorithm', () => {
  test('Should return true if a ship can fit in at least one direction', () => {
    const parameters = getFnCallObject([5, 5], 5);
    const result = canShipFit(parameters);
    expect(result).toBe(true);
    expect(canShipFit(getFnCallObject([0, 0], 10))).toBe(true);
  });
  test('Should return false if a ship cannot fit in at least one direction', () => {
    const parameters = getFnCallObject([5, 5], 11);
    const result = canShipFit(parameters);
    expect(result).toBe(false);
  });
  describe('Grid Edge Assessment Testing', () => {
    let topEdge, bottomEdge, leftEdge, rightEdge;
    beforeEach(() => {
      topEdge = getFnCallObject([0, 5], 5);
      bottomEdge = getFnCallObject([9, 5], 5);
      leftEdge = getFnCallObject([5, 0], 5);
      rightEdge = getFnCallObject([5, 9], 5);
    });
    test('Should handle edges with no obstacles', () => {
      expect(canShipFit(topEdge)).toBe(true);
      expect(canShipFit(bottomEdge)).toBe(true);
      expect(canShipFit(leftEdge)).toBe(true);
      expect(canShipFit(rightEdge)).toBe(true);
    });
    test('Should handle edges with obstacles allowing fit', () => {
      // Blocks adjacent row below and adjacent cell left of start
      helper.grid[1] = populateRow(helper.grid[1], 'MISS');
      helper.grid[0][4] = RESULTS.MISS;
      expect(canShipFit(topEdge)).toBe(true);

      // Blocks directly left and above
      helper.grid[5][8] = RESULTS.MISS;
      helper.grid[4][9] = RESULTS.MISS;
      expect(canShipFit(rightEdge)).toBe(true);

      // Blocks directly right and above
      helper.grid[5][1] = RESULTS.MISS;
      helper.grid[4][0] = RESULTS.MISS;
      expect(canShipFit(leftEdge)).toBe(true);

      // Blocks adjacent row above and adjacent cell left of start
      helper.grid[8] = populateRow(helper.grid[1], 'MISS');
      helper.grid[9][4] = RESULTS.MISS;
      expect(canShipFit(bottomEdge)).toBe(true);
    });
  });
  describe('Grid Corner Assessment Testing', () => {
    test('Should handle top-left corner assessment', () => {
      const topLeft = getFnCallObject([0, 0], 5);
      expect(canShipFit(topLeft)).toBe(true);
      // block right
      helper.grid[0][1] = RESULTS.MISS;
      expect(canShipFit(topLeft)).toBe(true);
      helper.grid[0][1] = RESULTS.UNEXPLORED;

      // block below
      helper.grid[1][0] = RESULTS.MISS;
      expect(canShipFit(topLeft)).toBe(true);

      // block both around
      helper.grid[0][1] = RESULTS.MISS;
      expect(canShipFit(topLeft)).toBe(false);
    });
    test('Should handle bottom-right corner assessment', () => {
      const bottomRight = getFnCallObject([9, 9], 5);
      // No obstacles
      expect(canShipFit(bottomRight)).toBe(true);

      // block left
      helper.grid[9][8] = RESULTS.MISS;
      expect(canShipFit(bottomRight)).toBe(true);
      helper.grid[9][8] = RESULTS.UNEXPLORED;

      // block above
      helper.grid[8][9] = RESULTS.MISS;
      expect(canShipFit(bottomRight)).toBe(true);

      // block both left and above
      helper.grid[9][8] = RESULTS.MISS;
      expect(canShipFit(bottomRight)).toBe(false);
    });
  });

  describe('Unresolved and Resolved Hit Assessments', () => {
    test('Should return true if ship can fit in a direction with unresolved adjacent hits and false when those hits are resolved', () => {
      // block adjacent surrounding except right
      helper.grid[4][5] = RESULTS.MISS;
      helper.grid[6][5] = RESULTS.MISS;
      helper.grid[5][4] = RESULTS.MISS;

      // unresolved adjacent hits
      helper.grid[5][6] = RESULTS.HIT;
      helper.grid[5][7] = RESULTS.HIT;
      helper.grid[5][8] = RESULTS.HIT;
      helper.grid[5][9] = RESULTS.HIT;

      const parameters = getFnCallObject([5, 5], 5);
      expect(canShipFit(parameters)).toBe(true);
      helper.resolved.add('5,6');
      expect(canShipFit(parameters)).toBe(false);
    });
  });
});
