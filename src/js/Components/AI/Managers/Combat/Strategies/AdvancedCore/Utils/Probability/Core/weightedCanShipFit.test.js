import { vi, describe, expect, it, beforeEach } from 'vitest';
import { STATUSES } from '../../../../../../../../../Utility/constants/common';
import { weightedCanShipFit } from './weightedCanShipFit';
import {
  createGrid,
  getCellInADirection,
  getCellStatusAt
} from '../../../../../../../../../Mocks/mockGridUtils';
import { getOrientationDirections } from '../../../../../../../../../Mocks/mockCoordinateUtils';

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

const getWeightedFitScore = (start, smallestShipLength) =>
  weightedCanShipFit({
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

describe('weightedCanShipFit function', () => {
  it('should return 1 when a ship can fit in both orientations', () => {
    expect(getWeightedFitScore([0, 0], 3)).toBe(1);
    expect(getWeightedFitScore([9, 9], 5)).toBe(1);
  });
  it('should return 0.5 when a ship can fit in one orientations', () => {
    grid[0][1].status = STATUSES.MISS;
    expect(getWeightedFitScore([0, 0], 3)).toBe(0.5);
    grid[8][9].status = STATUSES.MISS;
    expect(getWeightedFitScore([9, 9], 5)).toBe(0.5);
  });
  it('should return 0 when a ship cannot fit in any orientations', () => {
    grid[0][1].status = STATUSES.MISS;
    grid[1][0].status = STATUSES.MISS;
    expect(getWeightedFitScore([0, 0], 3)).toBe(0);
    grid[8][9].status = STATUSES.MISS;
    grid[9][8].status = STATUSES.MISS;
    expect(getWeightedFitScore([9, 9], 5)).toBe(0);
  });
  it('Should return non-zero when a ship can fit in an orientation given adjacent unresolved hits', () => {
    grid[0][1].status = STATUSES.HIT;
    grid[1][0].status = STATUSES.HIT;
    expect(getWeightedFitScore([0, 0], 3)).toBe(1);
    grid[8][9].status = STATUSES.HIT;
    grid[9][8].status = STATUSES.HIT;
    expect(getWeightedFitScore([9, 9], 5)).toBe(1);
  });
  it('Should return correct value when given adjacent resolved and unresolved consecutive hits', () => {
    grid[0][1].status = STATUSES.HIT;
    grid[1][0].status = STATUSES.HIT;
    grid[2][0].status = STATUSES.HIT;
    helpers.resolved.push([0, 1], [2, 0]);
    expect(getWeightedFitScore([0, 0], 3)).toBe(0);
    expect(getWeightedFitScore([0, 0], 2)).toBe(0.5);

    grid[8][9].status = STATUSES.HIT;
    grid[7][9].status = STATUSES.HIT;
    grid[6][9].status = STATUSES.HIT;
    grid[9][8].status = STATUSES.HIT;
    grid[9][7].status = STATUSES.HIT;
    grid[9][6].status = STATUSES.HIT;
    grid[9][5].status = STATUSES.HIT;
    grid[9][4].status = STATUSES.HIT;

    helpers.resolved.push([9, 4]);
    expect(getWeightedFitScore([9, 9], 5)).toBe(1);
    helpers.resolved.push([9, 6]);
    expect(getWeightedFitScore([9, 9], 5)).toBe(0.5);
    helpers.resolved.push([6, 9]);
    expect(getWeightedFitScore([9, 9], 5)).toBe(0);
  });
});
