import { vi, describe, expect, it, beforeEach } from 'vitest';
import { canShipFit } from './canShipFit';

import {
  createGrid,
  getCellStatusAt,
  getCellInADirection,
  STATUSES
} from '../../../../../../../Mocks/mockGridUtils';
import { getOrientationDirections } from '../../../../../../../Mocks/mockCoordinateUtils';

const populateRow = (row, result) => row.map((col) => (col = { status: STATUSES[result] }));

let grid = null;
const helpers = {
  resolved: [],
  getCellInADirection: (...args) => getCellInADirection(grid, ...args),
  getCellStatusAt: (...args) => getCellStatusAt(grid, ...args)
};
beforeEach(() => {
  helpers.resolved = [];
  grid = createGrid(10, 10, STATUSES.UNEXPLORED);
});

const checkIfShipCanFit = (start, smallestShipLength) =>
  canShipFit({
    getCellStatusAt: helpers.getCellStatusAt,
    getCellInADirection: helpers.getCellInADirection,
    getOrientationDirections,
    isHitResolved: vi.fn((cell) => {
      const index = helpers.resolved.findIndex((c) => c[0] === cell[0] && c[1] === cell[1]);
      return index !== -1;
    }),
    start,
    smallestShipLength
  });

describe('canShipFit Algorithm', () => {
  it('Should return true if a ship can fit in at least one direction', () => {
    const result = checkIfShipCanFit([5, 5], 5);
    expect(result).toBe(true);
  });
  it('Should return false if a ship cannot fit in at least one direction', () => {
    const result = checkIfShipCanFit([5, 5], 11);
    expect(result).toBe(false);
  });
  describe('Grid Edge Assessment Testing', () => {
    let topEdge, bottomEdge, leftEdge, rightEdge;
    beforeEach(() => {
      topEdge = [[0, 5], 5];
      bottomEdge = [[9, 5], 5];
      leftEdge = [[5, 0], 5];
      rightEdge = [[5, 9], 5];
    });
    it('Should handle edges with no obstacles', () => {
      expect(checkIfShipCanFit(...topEdge)).toBe(true);
      expect(checkIfShipCanFit(...bottomEdge)).toBe(true);
      expect(checkIfShipCanFit(...leftEdge)).toBe(true);
      expect(checkIfShipCanFit(...rightEdge)).toBe(true);
    });
    it('Should handle edges with obstacles allowing fit', () => {
      // Blocks adjacent row below and adjacent cell left of start
      grid[1] = populateRow(grid[1], 'MISS');
      grid[0][4] = { status: STATUSES.MISS };
      expect(checkIfShipCanFit(...topEdge)).toBe(true);

      // Blocks directly left and above
      grid[5][8] = { status: STATUSES.MISS };
      grid[4][9] = { status: STATUSES.MISS };
      expect(checkIfShipCanFit(...rightEdge)).toBe(true);

      // Blocks directly right and above
      grid[5][1] = { status: STATUSES.MISS };
      grid[4][0] = { status: STATUSES.MISS };
      expect(checkIfShipCanFit(...leftEdge)).toBe(true);

      // Blocks adjacent row above and adjacent cell left of start
      grid[8] = populateRow(grid[1], 'MISS');
      grid[9][4] = { status: STATUSES.MISS };
      expect(checkIfShipCanFit(...bottomEdge)).toBe(true);
    });
  });
  describe('Grid Corner Assessment Testing', () => {
    it('Should handle top-left corner assessment', () => {
      const topLeft = [[0, 0], 5];
      expect(checkIfShipCanFit(...topLeft)).toBe(true);
      // block right
      grid[0][1] = { status: STATUSES.MISS };
      expect(checkIfShipCanFit(...topLeft)).toBe(true);
      grid[0][1] = { status: STATUSES.UNEXPLORED };

      // block below
      grid[1][0] = { status: STATUSES.MISS };
      expect(checkIfShipCanFit(...topLeft)).toBe(true);

      // block both around
      grid[0][1] = { status: STATUSES.MISS };
      expect(checkIfShipCanFit(...topLeft)).toBe(false);
    });
    it('Should handle bottom-right corner assessment', () => {
      const bottomRight = [[9, 9], 5];
      // No obstacles
      expect(checkIfShipCanFit(...bottomRight)).toBe(true);

      // block left
      grid[9][8] = { status: STATUSES.MISS };
      expect(checkIfShipCanFit(...bottomRight)).toBe(true);
      grid[9][8] = { status: STATUSES.UNEXPLORED };

      // block above
      grid[8][9] = { status: STATUSES.MISS };
      expect(checkIfShipCanFit(...bottomRight)).toBe(true);

      // block both left and above
      grid[9][8] = { status: STATUSES.MISS };
      expect(checkIfShipCanFit(...bottomRight)).toBe(false);
    });
  });

  describe('Unresolved and Resolved Hit Assessments', () => {
    it('Should return true if ship can fit in a direction with unresolved adjacent hits and false when those hits are resolved', () => {
      // block adjacent surrounding except right
      grid[4][5] = { status: STATUSES.MISS };
      grid[6][5] = { status: STATUSES.MISS };
      grid[5][4] = { status: STATUSES.MISS };

      // unresolved adjacent hits
      grid[5][6] = { status: STATUSES.HIT };
      grid[5][7] = { status: STATUSES.HIT };
      grid[5][8] = { status: STATUSES.HIT };
      grid[5][9] = { status: STATUSES.HIT };

      expect(checkIfShipCanFit([5, 5], 5)).toBe(true);
      helpers.resolved.push([5, 7]);
      expect(checkIfShipCanFit([5, 5], 5)).toBe(false);
    });
  });
});
