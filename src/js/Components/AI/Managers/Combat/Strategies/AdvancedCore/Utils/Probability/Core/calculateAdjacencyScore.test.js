import { vi, describe, expect, it, beforeEach } from 'vitest';
import {
  getCellStatusAt,
  getCellsInAllDirections,
  STATUSES,
  createGrid
} from '../../../../../../../../../Mocks/mockGridUtils';
import { calculateAdjacencyScore } from './calculateAdjacencyScore';

const MISS_VALUE = 0.2;
const UNRESOLVED_HIT_VALUE = 2;
const UNEXPLORED_VALUE = 0.33;
const NUMBER_OF_ADJACENT_DIRECTIONS = 4;

let resolved = [];
let grid = null;
const helpers = {
  getCellStatusAt: (...args) => getCellStatusAt(grid, ...args),
  getCellsInAllDirections: (...args) => getCellsInAllDirections(grid, ...args),
  isHitResolved: vi.fn((cell) => {
    const index = resolved.findIndex((c) => c[0] === cell[0] && c[1] === cell[1]);
    return index !== -1;
  })
};

const getAdjacencyScore = (move) =>
  calculateAdjacencyScore(move, {
    getCellsInAllDirections: helpers.getCellsInAllDirections,
    getCellStatusAt: helpers.getCellStatusAt,
    isHitResolved: helpers.isHitResolved
  });

const getScore = ({ misses = 0, unresolvedHits = 0, unexplored = 0 }) =>
  (unexplored * UNEXPLORED_VALUE + unresolvedHits * UNRESOLVED_HIT_VALUE - misses * MISS_VALUE) /
  NUMBER_OF_ADJACENT_DIRECTIONS;

beforeEach(() => {
  resolved = [];
  grid = createGrid(10, 10, STATUSES.UNEXPLORED);
});
describe('calculateAdjacencyScore', () => {
  it('should calculate score correctly when all adjacent cells are unexplored', () => {
    const move = [5, 5];
    const score = getAdjacencyScore(move);
    expect(score).toBe(getScore({ unexplored: 4 }));
  });

  it('should calculate score correctly with missed shots around', () => {
    const move = [5, 5];
    grid[4][5] = { status: STATUSES.MISS };
    grid[6][5] = { status: STATUSES.MISS };
    const score = getAdjacencyScore(move);
    expect(score).toBe(getScore({ unexplored: 2, misses: 2 }));
  });

  it('should calculate score correctly with unresolved hits around', () => {
    const move = [5, 5];
    grid[5][4] = { status: STATUSES.HIT };
    grid[5][6] = { status: STATUSES.HIT };
    const score = getAdjacencyScore(move);
    expect(score).toBe(getScore({ unexplored: 2, unresolvedHits: 2 }));
  });

  it('should handle a mix of different cell statuses correctly', () => {
    const move = [5, 5];
    grid[4][5] = { status: STATUSES.MISS };
    grid[6][5] = { status: STATUSES.UNEXPLORED };
    grid[5][4] = { status: STATUSES.HIT };
    grid[5][6] = { status: STATUSES.HIT };
    resolved.push([5, 6]);
    const score = getAdjacencyScore(move);
    expect(score).toBe(getScore({ unexplored: 1, misses: 1, unresolvedHits: 1 }));
  });
});
