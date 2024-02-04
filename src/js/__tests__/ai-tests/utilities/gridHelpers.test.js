import { describe, expect, test, beforeEach } from 'vitest';
import { RESULTS, DIRECTIONS } from '../../../utility/constants';
import {
  getCellInADirection,
  getCellsInAllDirections,
  getHitsAround,
  getOpenMovesAround,
  getValueAt,
  getOpenMovesInADirection,
  isWithinGrid,
  getConsecutiveHitsInADirection
} from '../../../logic/ai/utilities/gridHelpers';

let grid;
const buildGrid = () => Array.from({ length: 10 }).map(() => Array.from({ length: 10 }).fill(null));
beforeEach(() => {
  grid = buildGrid();
});

describe('Coordinates Helper Object', () => {
  test('isWithinGrid - Should determine of coordinates are within the bounds of a grid', () => {
    expect(isWithinGrid(grid, [0, 0])).toBe(true);
    expect(isWithinGrid(grid, [-1, 0])).toBe(false);
    expect(isWithinGrid(grid, [9, 9])).toBe(true);
    expect(isWithinGrid(grid, [99, 99])).toBe(false);
  });
  test('getCellInADirection - Should return the adjacent cell in a given direction if valid', () => {
    expect(getCellInADirection(grid, [0, 0], 'right')).toEqual(DIRECTIONS.RIGHT);
    expect(getCellInADirection(grid, [0, 0], 'left')).toEqual(undefined);
    expect(getCellInADirection(grid, [0, 0], [1, 0])).toEqual(DIRECTIONS.DOWN);
    expect(getCellInADirection(grid, [0, 0], [-1, 0])).toEqual(undefined);
  });
  test('getCellsInAllDirections - Should return all valid adjacent cells to a given cell', () => {
    let cells, shouldInclude;

    cells = getCellsInAllDirections(grid, [0, 0]);
    shouldInclude = [
      [0, 1],
      [1, 0]
    ];
    expect(cells).toEqual(expect.arrayContaining(shouldInclude));

    cells = getCellsInAllDirections(grid, [5, 5]);
    shouldInclude = [
      [4, 5],
      [5, 4],
      [6, 5],
      [5, 6]
    ];
    expect(cells).toEqual(expect.arrayContaining(shouldInclude));
  });
  test('getHitsAround - Should return all adjacent hits around a given cell', () => {
    let cells, shouldInclude;
    grid[0][1] = RESULTS.HIT;
    grid[1][0] = RESULTS.HIT;
    grid[1][2] = RESULTS.HIT;
    grid[2][1] = RESULTS.HIT;

    cells = getHitsAround(grid, [1, 1]);
    shouldInclude = [
      [0, 1],
      [1, 0],
      [1, 2],
      [2, 1]
    ];
    expect(cells).toEqual(expect.arrayContaining(shouldInclude));

    grid[0][1] = RESULTS.MISS;
    grid[1][0] = RESULTS.MISS;
    cells = getHitsAround(grid, [1, 1]);
    shouldInclude = [
      [1, 2],
      [2, 1]
    ];
    expect(cells).toEqual(expect.arrayContaining(shouldInclude));
  });
  test('getOpenMovesAround - Should return all adjacent open moves (unexplored) around a given cell', () => {
    let cells, shouldInclude;
    cells = getOpenMovesAround(grid, [1, 1]);
    shouldInclude = [
      [0, 1],
      [1, 0],
      [1, 2],
      [2, 1]
    ];
    expect(cells).toEqual(expect.arrayContaining(shouldInclude));

    grid[0][1] = RESULTS.HIT;
    grid[1][0] = RESULTS.MISS;
    cells = getOpenMovesAround(grid, [1, 1]);
    shouldInclude = [
      [1, 2],
      [2, 1]
    ];
    expect(cells).toEqual(expect.arrayContaining(shouldInclude));
  });
  test('getValueAt - Should return value at a given cell', () => {
    grid[0][0] = RESULTS.UNEXPLORED;
    expect(getValueAt(grid, [0, 0])).toBe(RESULTS.UNEXPLORED);
    grid[4][4] = RESULTS.MISS;
    expect(getValueAt(grid, [4, 4])).toBe(RESULTS.MISS);
    grid[9][9] = RESULTS.HIT;
    expect(getValueAt(grid, [9, 9])).toBe(RESULTS.HIT);
  });
  test('getOpenMovesInADirection - Should return all open moves in a given direction', () => {
    expect(getOpenMovesInADirection(grid, [0, 0], DIRECTIONS.DOWN)).toEqual([
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
      [6, 0],
      [7, 0],
      [8, 0],
      [9, 0]
    ]);
    expect(getOpenMovesInADirection(grid, [0, 0], DIRECTIONS.LEFT)).toEqual([]);
    expect(getOpenMovesInADirection(grid, [0, 0], DIRECTIONS.RIGHT)).toEqual([
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5],
      [0, 6],
      [0, 7],
      [0, 8],
      [0, 9]
    ]);
    grid[4][0] = RESULTS.HIT;
    expect(getOpenMovesInADirection(grid, [0, 0], DIRECTIONS.DOWN)).toEqual([
      [1, 0],
      [2, 0],
      [3, 0]
    ]);
  });
  test('getConsecutiveHitsInADirection - Should return all hit cells in a given direction', () => {
    grid[0][1] = RESULTS.HIT;
    grid[0][2] = RESULTS.HIT;
    grid[0][3] = RESULTS.HIT;
    grid[0][4] = RESULTS.HIT;
    grid[0][5] = RESULTS.HIT;

    grid[1][0] = RESULTS.HIT;
    grid[2][0] = RESULTS.HIT;
    grid[3][0] = RESULTS.HIT;
    grid[4][0] = RESULTS.HIT;
    grid[5][0] = RESULTS.HIT;

    expect(getConsecutiveHitsInADirection(grid, [0, 0], DIRECTIONS.RIGHT, false)).toEqual([
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5]
    ]);
    expect(getConsecutiveHitsInADirection(grid, [0, 1], DIRECTIONS.RIGHT, true)).toEqual([
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5]
    ]);
    expect(getConsecutiveHitsInADirection(grid, [0, 0], DIRECTIONS.DOWN, false)).toEqual([
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0]
    ]);
    expect(getConsecutiveHitsInADirection(grid, [1, 0], DIRECTIONS.DOWN, true)).toEqual([
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0]
    ]);
  });
});
