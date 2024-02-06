import { vi, describe, expect, it, beforeEach } from 'vitest';
import { RESULTS } from '../../../utility/constants';
import { weightedCanShipFit } from '../../../logic/ai/advanced/strategies/weightedCanShipFit';

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
  helper.resolveHit = (hit) => helper.resolved.add(hit.join(','));
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

const helper = { grid: createGrid(10, 10) };
wrap(helper);
beforeEach(() => {
  helper.grid = createGrid(10, 10);
  helper.resolved.clear();
});

beforeEach(() => {
  vi.clearAllMocks();
});

const getResult = (start, smallestShipLength) =>
  weightedCanShipFit({
    getValueAt: helper.getValueAt,
    getCellInADirection: helper.getCellInADirection,
    getOrientationDirections: helper.getOrientationDirections,
    isHitResolved: helper.isHitResolved,
    start,
    smallestShipLength
  });

describe('weightedCanShipFit function', () => {
  it('should return 1 when a ship can fit in both orientations', () => {
    expect(getResult([0, 0], 3)).toBe(1);
    expect(getResult([9, 9], 5)).toBe(1);
  });
  it('should return 0.5 when a ship can fit in one orientations', () => {
    helper.grid[0][1] = RESULTS.MISS;
    expect(getResult([0, 0], 3)).toBe(0.5);
    helper.grid[8][9] = RESULTS.MISS;
    expect(getResult([9, 9], 5)).toBe(0.5);
  });
  it('should return 0 when a ship cannot fit in any orientations', () => {
    helper.grid[0][1] = RESULTS.MISS;
    helper.grid[1][0] = RESULTS.MISS;
    expect(getResult([0, 0], 3)).toBe(0);
    helper.grid[8][9] = RESULTS.MISS;
    helper.grid[9][8] = RESULTS.MISS;
    expect(getResult([9, 9], 5)).toBe(0);
  });
  it('Should return non-zero when a ship can fit in an orientation given adjacent unresolved hits', () => {
    helper.grid[0][1] = RESULTS.HIT;
    helper.grid[1][0] = RESULTS.HIT;
    expect(getResult([0, 0], 3)).toBe(1);
    helper.grid[8][9] = RESULTS.HIT;
    helper.grid[9][8] = RESULTS.HIT;
    expect(getResult([9, 9], 5)).toBe(1);
  });
  it('Should return correct value when given adjacent resolved and unresolved consecutive hits', () => {
    helper.grid[0][1] = RESULTS.HIT;
    helper.grid[1][0] = RESULTS.HIT;
    helper.grid[2][0] = RESULTS.HIT;
    helper.resolveHit([0, 1]);
    helper.resolveHit([2, 0]);
    expect(getResult([0, 0], 3)).toBe(0);
    expect(getResult([0, 0], 2)).toBe(0.5);

    helper.grid[8][9] = RESULTS.HIT;
    helper.grid[7][9] = RESULTS.HIT;
    helper.grid[6][9] = RESULTS.HIT;
    helper.grid[9][8] = RESULTS.HIT;
    helper.grid[9][7] = RESULTS.HIT;
    helper.grid[9][6] = RESULTS.HIT;
    helper.grid[9][5] = RESULTS.HIT;
    helper.grid[9][4] = RESULTS.HIT;

    helper.resolveHit([9, 4]);
    expect(getResult([9, 9], 5)).toBe(1);
    helper.resolveHit([9, 5]);
    expect(getResult([9, 9], 5)).toBe(0.5);
    helper.resolveHit([6, 9]);
    expect(getResult([9, 9], 5)).toBe(0);
  });
});
