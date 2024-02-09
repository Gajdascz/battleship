import { DIRECTIONS } from './utility/constants';

/**
 * @module inputValidators
 * Provides validation functions for commonly passed parameter values, allowing
 * centralized and consistent argument validation across the application.
 *
 * Functions validate:
 *  - Coordinates: Ensures pairs or arrays of pairs are valid [row, col] formats.
 *  - Directions: Validates direction strings or vectors against known valid directions.
 *  - Grids: Confirms grids are valid 2-dimensional arrays with consistent row lengths.
 */

/**
 * Validates that the input is a valid coordinate pair or an array of coordinate pairs.
 * Each coordinate pair should be an array of two numbers.
 *
 * @param {number[] | array[number[]]} coordinates - A single coordinate pair or an array of coordinate pairs to validate.
 * @throws {Error} Throws an error if any coordinate pair is invalid.
 * @returns {void}
 */
const validateCoordinates = (coordinates) => {
  const checkCoordinates = (coordinates) =>
    Array.isArray(coordinates) &&
    coordinates.length === 2 &&
    coordinates.every((coordinate) => typeof coordinate === 'number');
  if (Array.isArray(coordinates) && coordinates.every((coord) => Array.isArray(coord))) {
    coordinates.forEach((coordinatePair, index) => {
      if (!checkCoordinates(coordinatePair)) {
        throw new Error(
          `Invalid Coordinates at index ${index}: ${JSON.stringify(
            coordinatePair
          )}. Expected format: [number, number]`
        );
      }
    });
  } else {
    if (!checkCoordinates(coordinates)) {
      throw new Error(
        `Invalid Coordinates: ${JSON.stringify(coordinates)}. Expected format: [number, number]`
      );
    }
  }
};

/**
 * Validates that the input is a valid direction in string or vector format.
 * Each direction vector should be a coordinate pair containing a 0 and +-1.
 *
 * @param {string|number[]} direction String or vector representation of direction.
 * @returns {void}
 */
const validateDirection = (direction) => {
  const checkDirection = (direction) => {
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
  if (!checkDirection(direction)) throw new Error(`Invalid direction: ${direction}`);
};

/**
 * Validates that the input is a 2 dimensional grid array.
 *
 * @param {array[array[]]} grid - Nested array (2 levels) representing grid rows and columns grid[row][col].
 * @returns {void}
 */
const validateGrid = (grid) => {
  const allRowsAreEqual = () => grid.every((row) => row.length === grid[0].length);
  if (
    !grid ||
    !Array.isArray(grid) ||
    grid.length <= 0 ||
    !Array.isArray(grid[0]) ||
    grid[0].length <= 0 ||
    !allRowsAreEqual()
  ) {
    throw new Error(`Invalid grid: ${JSON.stringify(grid)}`);
  }
};

export { validateCoordinates, validateDirection, validateGrid };
