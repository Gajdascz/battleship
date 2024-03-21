import { describe, it, expect, beforeEach } from 'vitest';
import { STATUSES, DIRECTIONS } from '../constants/common.js';
import {
  createGrid,
  isWithinGrid,
  copyGrid,
  isAtEdge,
  getValueAt,
  getCellInADirection,
  getCellsInAllDirections,
  getTypeOfCellInADirection,
  getOpenMovesAround,
  getCellStatusAt
} from './gridUtils.js';

describe('Grid Utilities', () => {
  let grid = null;
  beforeEach(() => {
    grid = createGrid(5, 5, STATUSES.UNEXPLORED);
  });
  it('createGrid should create a grid of correct dimensions with specified fill', () => {
    expect(grid).toHaveLength(5);
    expect(grid[0]).toHaveLength(5);
    expect(grid[4][4]).toEqual({ status: STATUSES.UNEXPLORED });
  });

  it('isWithinGrid should correctly identify cells within and outside grid bounds', () => {
    expect(isWithinGrid(grid, [0, 0])).toBe(true);
    expect(isWithinGrid(grid, [4, 4])).toBe(true);
    expect(isWithinGrid(grid, [5, 5])).toBe(false);
    expect(isWithinGrid(grid, [-1, 0])).toBe(false);
  });

  it('copyGrid should create a deep copy of the grid', () => {
    const copy = copyGrid(grid);
    expect(copy).toEqual(grid);
    expect(copy).not.toBe(grid);
  });

  it('isAtEdge should correctly identify cells at the edge of the grid', () => {
    expect(isAtEdge(grid, [0, 2])).toBe(true);
    expect(isAtEdge(grid, [4, 2])).toBe(true);
    expect(isAtEdge(grid, [2, 0])).toBe(true);
    expect(isAtEdge(grid, [2, 4])).toBe(true);
    expect(isAtEdge(grid, [2, 2])).toBe(false);
  });

  it('getValueAt should return the correct value or undefined', () => {
    expect(getValueAt(grid, [0, 0])).toEqual({ status: STATUSES.UNEXPLORED });
    expect(getValueAt(grid, [5, 5])).toBeUndefined();
  });
  it('getCellStatusAt should return the stored status property at given coordinates', () => {
    expect(getCellStatusAt(grid, [0, 0])).toBe(STATUSES.UNEXPLORED);
  });

  it('getCellInADirection should return adjacent cell coordinates or undefined', () => {
    const direction = DIRECTIONS.UP;
    const start = [2, 2];
    const expected = [1, 2];
    expect(getCellInADirection(grid, start, direction)).toEqual(expected);
    expect(getCellInADirection(grid, [0, 0], direction)).toBeUndefined();
  });

  it('getCellsInAllDirections should return all adjacent cell coordinates within the grid', () => {
    const grid = createGrid(3, 3, STATUSES.UNEXPLORED);
    const coordinates = [1, 1];
    const adjacentCells = getCellsInAllDirections(grid, coordinates);
    expect(adjacentCells).toHaveLength(4);
  });

  it('getOpenMovesAround returns coordinates of all adjacent unexplored cells', () => {
    const grid = createGrid(3, 3, STATUSES.UNEXPLORED);
    grid[1][0].status = STATUSES.HIT;
    const openMoves = getOpenMovesAround(grid, [1, 1]);

    expect(openMoves).toHaveLength(3);
  });

  describe('getTypeOfCellInADirection returns consecutive types of cell in a given direction', () => {
    it('should return open cells in a direction', () => {
      const start = [2, 2];
      const direction = DIRECTIONS.RIGHT;
      grid[2][4].status = STATUSES.HIT;
      const openMoves = getTypeOfCellInADirection({
        grid,
        start,
        direction,
        type: STATUSES.UNEXPLORED
      });
      expect(openMoves).toHaveLength(1);
    });
    it('should return hit cells in a direction', () => {
      grid[2][2].status = STATUSES.HIT;
      grid[2][3].status = STATUSES.HIT;
      const start = [2, 1];
      const direction = [0, 1];
      const hits = getTypeOfCellInADirection({ grid, start, direction, type: STATUSES.HIT });
      expect(hits).toHaveLength(2);
    });
  });
});
