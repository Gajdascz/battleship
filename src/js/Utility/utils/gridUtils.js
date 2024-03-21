import { STATUSES, DIRECTIONS } from '../constants/common';
import { sumCoordinates } from './coordinatesUtils';
/**
 * @module gridUtils
 * Provides a wide range of utilities for 2D grid-based operations.
 */

/**
 * Creates a Row x Column grid 2D array.
 *
 * @param {number} rows Number of rows.
 * @param {number} cols Number of columns.
 * @param {*} fill Default value to set each cell's status to.
 * @returns {Object[]} Array of objects containing cell data.
 */
const createGrid = (rows, cols, fill = null) =>
  Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({ status: fill })));

/**
 * Checks if a cell's coordinates are within the boundaries of a grid.
 *
 * @param {array[][]} grid The game grid.
 * @param {number[]} coordinates The cells coordinates.
 * @returns {boolean} True if the cell is within grid, false otherwise.
 */
const isWithinGrid = (grid, coordinates) => {
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
const copyGrid = (grid) => grid.map((row) => [...row]);

/**
 * Checks if coordinates are at the edge of a grid.
 *
 * @param {array[][]} grid The grid to evaluate.
 * @param {number[]} coordinates The cell's coordinates.
 * @returns {boolean} True if the cell is at edge of grid, false otherwise.
 */
const isAtEdge = (grid, coordinates) =>
  coordinates[0] === 0 ||
  coordinates[1] === 0 ||
  coordinates[0] === grid.length - 1 ||
  coordinates[1] === grid[0].length - 1;

/**
 * Returns the stored value at given coordinates.
 *
 * @param {array[][]} grid The grid to evaluate.
 * @param {number[]} coordinates Location of cell within the grid.
 * @returns {null | integer | undefined} The known value at the provided cell.
 */
const getValueAt = (grid, coordinates) => {
  if (isWithinGrid(grid, coordinates)) return grid[coordinates[0]][coordinates[1]];
  return undefined;
};

/**
 * Returns the status property in the stored value at given coordinates.
 *
 * @param {array[][]} grid The grid to evaluate.
 * @param {number[]} coordinates Location of cell within the grid.
 * @returns {null | integer | undefined} The known value at the provided cell.
 */
const getCellStatusAt = (grid, coordinates) => {
  const cellValue = getValueAt(grid, coordinates);
  if (cellValue) return cellValue.status;
  return undefined;
};

/**
 * Finds the adjacent cell in a specified direction if it's within grid bounds.
 *
 * @param {array[][]} grid The grid to navigate.
 * @param {number[]|string} direction The direction in which to follow in vector or string format.
 * @param {number[]} coordinates The starting cell's coordinates.
 * @returns {number[]|undefined} The adjacent cell's coordinates, if within grid bounds.
 */
const getCellInADirection = (grid, coordinates, direction) => {
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
const getCellsInAllDirections = (grid, coordinates) => {
  const cellsAround = [];
  for (const direction of Object.keys(DIRECTIONS)) {
    const cellInDirection = getCellInADirection(grid, coordinates, direction);
    if (cellInDirection) cellsAround.push(cellInDirection);
  }
  return cellsAround;
};

/**
 * Finds adjacent cells marked as 'unexplored'.
 *
 * @param {array[][]} grid The grid to navigate.
 * @param {number[]} coordinates The central cell's coordinates.
 * @returns {array[number[]]} Coordinates of unexplored adjacent cells within the grid.
 */
const getOpenMovesAround = (grid, coordinates) =>
  getCellsInAllDirections(grid, coordinates).filter(
    (coordinates) => getCellStatusAt(grid, coordinates) === STATUSES.UNEXPLORED
  );

/**
 * Finds consecutive cells of a specified type in a direction.
 *
 * @param {array[][]} grid The grid to navigate.
 * @param {number[]} start Cell to start navigation at.
 * @param {number[]} direction Direction vector to follow.
 * @param {string} type Type of cell to account for.
 * @returns {array[number[]]} Array of adjacent coordinates of specified type.
 */
const getTypeOfCellInADirection = ({ grid, start, direction, type }) => {
  const cellsOfType = [];
  let nextCell = sumCoordinates(start, direction);
  while (getCellStatusAt(grid, nextCell) === type) {
    cellsOfType.push(nextCell);
    nextCell = sumCoordinates(nextCell, direction);
  }
  return cellsOfType;
};

export {
  createGrid,
  isWithinGrid,
  copyGrid,
  isAtEdge,
  getValueAt,
  getCellStatusAt,
  getCellInADirection,
  getCellsInAllDirections,
  getOpenMovesAround,
  getTypeOfCellInADirection
};
