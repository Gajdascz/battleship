import { validateGrid, validateCoordinates, validateDirection } from './inputValidators';
import { DIRECTIONS, RESULTS } from '../../../Utility/constants';
import { sumCoordinates } from './coordinatesHelpers';

/**
 * @module gridHelpers
 * Provides utility functions allowing the AI to analyze and interact with its tracking grid
 * in a 2-dimensional game board context. Designed to assist in strategic decision-making by
 * offering tools to assess cell states, adjacency, and potential moves within the grid.
 *
 * Grid:
 *  - Operates on a 2-dimensional array with a [row, col] coordinate system.
 *  Can Contain:
 *    - number: Represents hits as 1 and misses as 0, facilitating tracking of previous attempts.
 *    - null: Indicates an unexplored cell, awaiting AI decision.
 *
 * Coordinates:
 *  - Are represented as an array of two numbers [row, col], corresponding to grid positions.
 *
 */

/**
 * Checks if a cell's coordinates are within the boundaries of a grid.
 *
 * @param {array[][]} grid The game grid.
 * @param {number[]} coordinates The cells coordinates.
 * @returns {boolean} True if the cell is within grid, false otherwise.
 */
export const isWithinGrid = (grid, coordinates) => {
  validateGrid(grid);
  validateCoordinates(coordinates);
  const bounds = [grid.length, grid[0].length];
  return (
    coordinates[0] >= 0 &&
    coordinates[0] < bounds[0] &&
    coordinates[1] >= 0 &&
    coordinates[1] < bounds[1]
  );
};

/**
 * Creates a deep copy of a 2-dimensional grid.
 *
 * @param {array[number[]]} grid The grid to copy
 * @returns {array[number[]]} A deep copy of the grid.
 */
export const copyGrid = (grid) => grid.map((row) => [...row]);

/**
 * Checks if coordinates are at the edge of a grid.
 *
 * @param {array[][]} grid The grid to evaluate.
 * @param {number[]} coordinates The cell's coordinates.
 * @returns {boolean} True if the cell is at edge of grid, false otherwise.
 */
export const isAtEdge = (grid, coordinates) =>
  coordinates[0] === 0 ||
  coordinates[1] === 0 ||
  coordinates[0] === grid.length - 1 ||
  coordinates[1] === grid[0].length - 1;

/**
 * Finds the adjacent cell in a specified direction if it's within grid bounds.
 *
 * @param {array[][]} grid The grid to navigate.
 * @param {number[]|string} direction The direction in which to follow in vector or string format.
 * @param {number[]} coordinates The starting cell's coordinates.
 * @returns {number[]|undefined} The adjacent cell's coordinates, if within grid bounds.
 */
export const getCellInADirection = (grid, coordinates, direction) => {
  validateGrid(grid);
  validateCoordinates(coordinates);
  validateDirection(direction);
  let vector = direction;
  if (typeof vector === 'string') vector = DIRECTIONS[vector.toUpperCase()];
  const result = sumCoordinates(vector, coordinates);
  return isWithinGrid(grid, result) ? result : undefined;
};

/**
 * Finds all adjacent cells within grid bounds.
 *
 * @param {array[][]} grid The grid to navigate.
 * @param {number[]} coordinates The central cell's coordinates.
 * @returns {array[number[]]} Coordinates of all adjacent cells within the grid.
 */
export const getCellsInAllDirections = (grid, coordinates) => {
  const cellsAround = [];
  for (const direction of Object.keys(DIRECTIONS)) {
    const cellInDirection = getCellInADirection(grid, coordinates, direction);
    if (cellInDirection) cellsAround.push(cellInDirection);
  }
  return cellsAround;
};

/**
 * Finds adjacent cells marked as 'hit.
 *
 * @param {array[][]} grid The grid to navigate.
 * @param {number[]} coordinates The central cell's coordinates.
 * @returns {array[number[]]} Coordinates of adjacent cells that are hits within the grid.
 */
export const getHitsAround = (grid, coordinates) =>
  getCellsInAllDirections(grid, coordinates).filter(
    (coordinates) => getValueAt(grid, coordinates) === RESULTS.HIT
  );

/**
 * Finds adjacent cells marked as 'unexplored'.
 *
 * @param {array[][]} grid The grid to navigate.
 * @param {number[]} coordinates The central cell's coordinates.
 * @returns {array[number[]]} Coordinates of unexplored adjacent cells within the grid.
 */
export const getOpenMovesAround = (grid, coordinates) =>
  getCellsInAllDirections(grid, coordinates).filter(
    (coordinates) => getValueAt(grid, coordinates) === RESULTS.UNEXPLORED
  );

/**
 * Returns status or value at given coordinates.
 *
 * @param {array[][]} grid The grid to evaluate.
 * @param {number[]} coordinates Location of cell within the grid.
 * @returns {null | integer | undefined} The known value at the provided cell.
 * Possible Values:
 *  -'null': Unexplored
 *  -'0': Miss
 *  -'1': Hit
 *  - undefined: Invalid
 */
export const getValueAt = (grid, coordinates) => {
  validateGrid(grid);
  validateCoordinates(coordinates);

  if (isWithinGrid(grid, coordinates)) return grid[coordinates[0]][coordinates[1]];
  return undefined;
};

/**
 * Finds consecutive cells of a specified type in a direction.
 *
 * @param {array[][]} grid The grid to navigate.
 * @param {number[]} start Cell to start navigation at.
 * @param {number[]} direction Direction vector to follow.
 * @param {string} type Type of cell to account for.
 * @returns {array[number[]]} Array of adjacent coordinates of specified type.
 */
export const getTypeOfCellInADirection = (grid, start, direction, type) => {
  const cellsOfType = [];
  let nextCell = sumCoordinates(start, direction);
  while (getValueAt(grid, nextCell) === RESULTS[type]) {
    cellsOfType.push(nextCell);
    nextCell = sumCoordinates(nextCell, direction);
  }
  return cellsOfType;
};

/**
 * Finds consecutive unexplored cells in a given direction.
 *
 * @param {array[][]} grid The grid to navigate.
 * @param {number[]} start Cell to start navigation at.
 * @param {number[]} direction Direction vector to follow.
 * @returns {array[number[]]} Array of consecutive adjacent unexplored coordinates.
 */
export const getOpenMovesInADirection = (grid, start, direction) =>
  getTypeOfCellInADirection(grid, start, direction, 'UNEXPLORED');

/**
 * Finds consecutive hit cells in a given direction.
 *
 * @param {array[][]} grid The grid to navigate.
 * @param {number[]} start Cell to start navigation at.
 * @param {number[]} direction Direction vector to follow.
 * @returns {array[number[]]} Array of consecutive adjacent hit coordinates.
 */
export const getConsecutiveHitsInADirection = (grid, start, direction) => {
  const hitsInDirection = [];
  hitsInDirection.push(...getTypeOfCellInADirection(grid, start, direction, 'HIT'));
  return hitsInDirection;
};
