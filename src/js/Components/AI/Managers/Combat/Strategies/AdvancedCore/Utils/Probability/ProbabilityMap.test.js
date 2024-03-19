import { vi, describe, expect, it, beforeEach } from 'vitest';
import {
  createGrid,
  getCellStatusAt,
  getCellInADirection,
  getCellsInAllDirections,
  getOpenMovesAround,
  STATUSES
} from '../../../../../../../../Mocks/mockGridUtils';
import { getOrientationDirections } from '../../../../../../../../Mocks/mockCoordinateUtils';
import { canShipFit } from '../canShipFit';
import { ProbabilityMap } from './ProbabilityMap';

let resolved = [];
let grid = null;
let probabilityMap = null;

const checkCanShipFit = (move, smallestShipLength) =>
  canShipFit({
    getCellStatusAt: helpers.getCellStatusAt,
    getCellInADirection: helpers.getCellsInADirection,
    getOrientationDirections,
    isHitResolved: helpers.isHitResolved,
    start: move,
    smallestShipLength
  });

const helpers = {
  getCellStatusAt: (...args) => getCellStatusAt(grid, ...args),
  getCellsInAllDirections: (...args) => getCellsInAllDirections(grid, ...args),
  getCellsInADirection: (...args) => getCellInADirection(grid, ...args),
  getOpenMovesAround: (...args) => getOpenMovesAround(grid, ...args),
  isHitResolved: vi.fn((cell) => {
    const index = resolved.findIndex((c) => c[0] === cell[0] && c[1] === cell[1]);
    return index !== -1;
  }),
  validateMove: (move, smallestShipLength = 2) =>
    move &&
    helpers.getCellStatusAt(move) === STATUSES.UNEXPLORED &&
    checkCanShipFit(move, smallestShipLength),
  getSmallestShipLength: vi.fn(() => 2)
};
const gridHelpers = {
  getCellStatusAt: helpers.getCellStatusAt,
  getCellInADirection: helpers.getCellsInADirection,
  getCellsInAllDirections: helpers.getCellsInAllDirections,
  getOpenMovesAround: helpers.getOpenMovesAround
};
beforeEach(() => {
  resolved = [];
  grid = createGrid(10, 10, STATUSES.UNEXPLORED);
  probabilityMap = ProbabilityMap({
    initialGrid: grid,
    gridHelpers,
    getOrientationDirections,
    isHitResolved: helpers.isHitResolved,
    getSmallestShipLength: helpers.getSmallestShipLength,
    validateFn: helpers.validateMove
  });
});

describe('ProbabilityMap', () => {
  it('should initialize and assigns initial probabilities correctly', () => {
    grid.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        const score = probabilityMap.calculateProbabilityScore([rowIndex, colIndex]);
        expect(score).toBeGreaterThan(-1);
      });
    });
  });
  it('should identify and retrieves the cell with the highest probability', () => {
    grid[0][1].status = STATUSES.MISS;
    grid[1][0].status = STATUSES.MISS;
    grid[2][1].status = STATUSES.MISS;
    grid[1][1].status = STATUSES.HIT;
    probabilityMap.updateState(grid);
    const highestProbCell = probabilityMap.getCellWithHighestProbability();
    expect(highestProbCell).toEqual([1, 2]);
  });
  it('updates probability scores upon state change', () => {
    helpers.getSmallestShipLength.mockReturnValueOnce(3);
    grid[1][1].status = STATUSES.HIT;
    resolved.push([1, 1]);
    probabilityMap.updateState(grid, true);
    const scoreAfterUpdate = probabilityMap.calculateProbabilityScore([1, 1]);
    expect(scoreAfterUpdate).toBeLessThan(1);
  });
  it('should retrieve the move with the highest probability from a set of moves', () => {
    const moves = [
      [2, 2],
      [3, 3],
      [4, 4]
    ];
    const highestProbMove = probabilityMap.getHighestProbabilityFromMoves(moves);
    expect(moves).toContainEqual(highestProbMove);
  });
  it('identifies the hit with the highest surrounding probability', () => {
    grid[3][3].status = STATUSES.HIT;
    const hitWithHighestSurroundingProb = probabilityMap.getHitWithHighestSurroundingProbability([
      [3, 3],
      [5, 5]
    ]);
    expect(hitWithHighestSurroundingProb).toEqual([3, 3]);
  });
  it('handles edge cases appropriately', () => {
    helpers.getSmallestShipLength.mockReturnValueOnce(1);
    probabilityMap = ProbabilityMap({
      initialGrid: grid,
      gridHelpers,
      getOrientationDirections,
      isHitResolved: helpers.isHitResolved,
      getSmallestShipLength: () => 1,
      validateFn: (move) => move[0] === 9 && move[1] === 9
    });
    grid.forEach((row, i) =>
      row.forEach((cell, j) => {
        if (!(i === 9 && j === 9)) grid[i][j].status = STATUSES.MISS;
      })
    );
    probabilityMap.updateState(grid);
    const highestProbCell = probabilityMap.getCellWithHighestProbability();
    expect(highestProbCell).toEqual([9, 9]);
  });
  it('accurately updates probabilities after hits are resolved', () => {
    grid[5][5].status = STATUSES.HIT;
    const originalScores = [
      [5, 6],
      [5, 4],
      [4, 5],
      [6, 5]
    ].map((coords) => probabilityMap.calculateProbabilityScore(coords));
    resolved.push([5, 5]);
    const adjustedScores = [
      [5, 6],
      [5, 4],
      [4, 5],
      [6, 5]
    ].map((coords) => probabilityMap.calculateProbabilityScore(coords));

    adjustedScores.forEach((score, index) => {
      const isLess = score < originalScores[index];
      expect(isLess).toBeTruthy();
    });
  });

  it('recalculates probabilities accurately when a ship is sunk', () => {
    helpers.getSmallestShipLength.mockReturnValueOnce(4);
    probabilityMap.updateState(grid, true);

    const recalculatedScore = probabilityMap.calculateProbabilityScore([2, 3]);
    expect(recalculatedScore).toBeGreaterThan(0);
  });

  it('selects among highest probability cells correctly when tied', () => {
    const tiedMoves = [
      [0, 2],
      [1, 3],
      [2, 4]
    ];
    const selectedMove = probabilityMap.getHighestProbabilityFromMoves(tiedMoves);
    expect(tiedMoves).toContainEqual(selectedMove);
  });

  it('considers different cell statuses (MISS, HIT, UNEXPLORED) in probability calculation', () => {
    grid[4][4].status = STATUSES.MISS;
    grid[5][5].status = STATUSES.HIT;
    probabilityMap.updateState(grid);
    const influencedScore = probabilityMap.calculateProbabilityScore([6, 6]);
    expect(influencedScore).toBeGreaterThan(0);
  });
});
