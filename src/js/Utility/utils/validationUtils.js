import { DIRECTIONS } from '../constants/common';
/**
 * @module inputValidators
 * Provides input validation and testing functions for commonly passed parameter values, allowing
 * centralized and consistent argument validation across the application.
 *
 * Functions validate/test:
 *  - Coordinates: Ensures pairs or arrays of pairs are valid [row, col] formats.
 *  - Directions: Validates direction strings or vectors against known valid directions.
 *  - Grids: Confirms grids are valid 2-dimensional arrays with consistent row lengths.
 */

/**
 * Tests if the input is a valid array of coordinate pairs.
 *
 * @param {number[] | array[number[]]} coordinates Array of coordinate pairs to validate.
 * @returns {boolean} True if all coordinate pairs are valid, false otherwise.
 */
const areCoordinatePairs = (pairs) =>
  pairs.every((coordinates) => Array.isArray(coordinates) && isCoordinatePair(coordinates));

/**
 * Tests if input is a valid coordinate pair containing two numbers.
 *
 * @param {number[]} coordinates A single pair of coordinates.
 * @returns {boolean} True if valid coordinate pair, false otherwise.
 */
const isCoordinatePair = (coordinates) =>
  Array.isArray(coordinates) &&
  coordinates.length === 2 &&
  coordinates.every((coordinate) => typeof coordinate === 'number');

/**
 * Tests if the input is a valid direction in string or vector format.
 * Each direction vector should be a coordinate pair containing a 0 and +-1.
 *
 * @param {string|number[]} direction String or vector representation of direction.
 * @returns {boolean} True if defined direction, false otherwise.
 */

const isValidDirection = (direction) => {
  if (typeof direction === 'string') {
    const upperCaseDirection = direction.toUpperCase();
    return (
      upperCaseDirection === 'UP' ||
      upperCaseDirection === 'DOWN' ||
      upperCaseDirection === 'RIGHT' ||
      upperCaseDirection === 'LEFT'
    );
  }
  if (Array.isArray(direction) && direction.length === 2) {
    return Object.values(DIRECTIONS).some(
      (validDirection) => direction[0] === validDirection[0] && direction[1] === validDirection[1]
    );
  }
  return false;
};

/**
 * Tests if the input is a 2 dimensional grid array.
 *
 * @param {array[array[]]} grid - Nested array (2 levels) representing grid rows and columns grid[row][col].
 * @returns {boolean} True if valid, false otherwise.
 */
const isValidGrid = (grid) => {
  const allRowsAreEqual = () => grid.every((row) => row.length === grid[0].length);
  return (
    grid ||
    Array.isArray(grid) ||
    grid.length <= 0 ||
    Array.isArray(grid[0]) ||
    grid[0].length <= 0 ||
    allRowsAreEqual()
  );
};

/**
 * Validates that the input is a valid coordinate pair or an array of coordinate pairs.
 * @param {number[] | array[number[]]} coordinates A single coordinate pair or an array of coordinate pairs to validate.
 * @throws {Error} Throws an error if any coordinate pair is invalid.
 * @returns {void}
 */
const validateCoordinates = (coordinates) => {
  if (Array.isArray(coordinates[0])) {
    if (!areCoordinatePairs(coordinates)) {
      throw new Error(
        `Invalid Coordinates In ${JSON.stringify(coordinates)}. Expected format: [[number, number]]`
      );
    }
  } else {
    if (!isCoordinatePair(coordinates)) {
      throw new Error(
        `Invalid Coordinate Pair: ${JSON.stringify(coordinates)}. Expected format: [number, number]`
      );
    }
  }
};

/**
 * Validates that the input is a valid direction in string or vector format.
 * Each direction vector should be a coordinate pair containing a 0 and +-1.
 *
 * @param {string|number[]} direction String or vector representation of direction.
 * @throws {Error} Throws an error if direction is not defined.
 * @returns {void}
 */

const validateDirection = (direction) => {
  if (!isValidDirection(direction)) throw new Error(`Invalid direction: ${direction}`);
};

/**
 * Validates that the input is a 2 dimensional grid array.
 *
 * @param {array[array[]]} grid - Nested array (2 levels) representing grid rows and columns grid[row][col].
 * @throws {Error} Throws an error if the grid is not a valid 2D array.
 * @returns {void}
 */
const validateGrid = (grid) => {
  if (!isValidGrid) throw new Error(`Invalid grid: ${JSON.stringify(grid)}`);
};

export {
  isCoordinatePair,
  areCoordinatePairs,
  isValidDirection,
  isValidGrid,
  validateCoordinates,
  validateDirection,
  validateGrid
};
