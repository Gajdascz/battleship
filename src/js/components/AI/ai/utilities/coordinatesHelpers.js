import { validateCoordinates } from './inputValidators';
import { DIRECTIONS, ORIENTATIONS } from '../../../utility/constants';

/**
 * @module coordinatesHelpers
 * Provides utility functions for AI with 2D grid coordinate pairs in spatial analysis and navigation.
 * Allows operations such as orientation processing, direction determination, and vector arithmetic within a Cartesian coordinate system.
 *
 * Features include:
 * - Calculating directional vectors and deltas between coordinates.
 * - Determining if coordinates are adjacent and in the correct orientation.
 * - Converting orientation strings to directional vectors for easy manipulation.
 *
 * Coordinates are represented as arrays of two integers [x, y], assuming a zero-indexed grid where (0, 0) is the top-left corner.
 */

// Cleans orientation string input for ease of use
const normalizeOrientationString = (orientationString) => orientationString.toLowerCase().trim();

// Returns the difference between two coordinates as absolute, single step values.
const getAbsoluteDeltaVector = (coordinatesOne, coordinatesTwo) => {
  const deltaVector = getDelta(coordinatesOne, coordinatesTwo, true);
  return [Math.abs(deltaVector[0]), Math.abs(deltaVector[1])];
};

// Checks if two sets of coordinates are aligned diagonally.
const isDiagonal = (coordinatesOne, coordinatesTwo) => {
  const vector = getAbsoluteDeltaVector(coordinatesOne, coordinatesTwo);
  return vector[0] === 1 && vector[1] === 1;
};

/**
 * Checks if two sets of coordinates are aligned in the horizontal orientation.
 *
 * @param {number[]} coordinatesOne Coordinates to compare.
 * @param {number[]} coordinatesTwo Coordinates to compare.
 * @returns {boolean} True if given coordinates are horizontally aligned, false otherwise.
 */
const isHorizontal = (coordinatesOne, coordinatesTwo) =>
  !isDiagonal(coordinatesOne, coordinatesTwo) && coordinatesOne[0] === coordinatesTwo[0];

/**
 * Checks if two sets of coordinates are aligned in the vertical orientation.
 *
 * @param {number[]} coordinatesOne Coordinates to compare.
 * @param {number[]} coordinatesTwo Coordinates to compare.
 * @returns {boolean} True if given coordinates are vertically aligned, false otherwise.
 */
const isVertical = (coordinatesOne, coordinatesTwo) =>
  !isDiagonal(coordinatesOne, coordinatesTwo) && coordinatesOne[1] === coordinatesTwo[1];

/**
 * Tests if given vector is a single step in the horizontal or vertical orientation.
 *
 * @param {number[]} testVector Vector to test.
 * @returns {boolean} True if vector is a single step, false otherwise.
 */
const isSingleStepVector = (testVector) => {
  const vector = [Math.abs(testVector[0]), Math.abs(testVector[1])];
  return (vector[0] === 1 && vector[1] === 0) || (vector[0] === 0 && vector[1] === 1);
};

/**
 * Calculates the sum of two coordinates.
 *
 * @param {number[]} coordinatesOne Coordinate pair to sum.
 * @param {number[]} coordinatesTwo Coordinate pair to sum.
 * @returns {number[]} The sum of the two coordinates.
 * @throws {Error} If coordinate pairs are not arrays containing numbers.
 */
const sumCoordinates = (coordinatesOne, coordinatesTwo) => {
  validateCoordinates([coordinatesOne, coordinatesTwo]);
  const dx = coordinatesOne[0] + coordinatesTwo[0];
  const dy = coordinatesOne[1] + coordinatesTwo[1];
  const result = [dx, dy];
  return result;
};

/**
 * Provides the direction vectors in correlation to the provided orientation.
 *
 * @param {string} orientation String representation of the orientation.
 * @returns {object} Contains the name of the direction as keys and array vectors as values.
 * @throws {Error} If coordinate pairs are not arrays containing numbers.
 * @example Given 'vertical' returns { up: [-1,0], down: [1,0] }
 */
const getOrientationDirections = (orientation) => {
  const cleanOrientation = normalizeOrientationString(orientation);
  if (
    !(cleanOrientation === ORIENTATIONS.VERTICAL || cleanOrientation === ORIENTATIONS.HORIZONTAL)
  ) {
    throw new Error(`Invalid Orientation: ${cleanOrientation}`);
  }
  if (cleanOrientation === ORIENTATIONS.VERTICAL)
    return { up: DIRECTIONS.UP, down: DIRECTIONS.DOWN };
  else return { left: DIRECTIONS.LEFT, right: DIRECTIONS.RIGHT };
};

/**
 * Calculates the difference between two coordinates.
 *
 * @param {number[]} prev Coordinate previous to the next pair.
 * @param {number[]} next Coordinate after the previous pair.
 * @param {boolean} forceSingleStep Enforces a single step delta is returned [+-1, 0], [0,+-1].
 * @returns {number[]} The difference of the two coordinates.
 * @throws {Error} If coordinate pairs are not arrays containing numbers.
 */
const getDelta = (prev, next, forceSingleStep = false) => {
  validateCoordinates([prev, next]);
  const toSingleStepVector = (coordinate) =>
    coordinate === 0 ? 0 : coordinate / Math.abs(coordinate);
  const dx = next[0] - prev[0];
  const dy = next[1] - prev[1];
  return forceSingleStep ? [toSingleStepVector(dx), toSingleStepVector(dy)] : [dx, dy];
};

/**
 * Provides the two adjacent coordinate pairs perpendicular to the given origin coordinates.
 *
 * @param {number[]} origin The origin cell to get adjacent cells around.
 * @param {string} orientation Orientation to get perpendicular directions for.
 * @returns {array[number[]]} The coordinates perpendicular to the origin's orientation.
 * @throws {Error} If coordinate pairs are not arrays containing numbers or orientation is not recognized.
 * @example Given [1,1] and 'vertical', returns [[1,0],[1,2]]
 */
const getPerpendicularCoordinates = (origin, orientation) => {
  validateCoordinates(origin);
  const cleanOrientation = normalizeOrientationString(orientation);
  if (cleanOrientation === ORIENTATIONS.VERTICAL) {
    const { left, right } = getOrientationDirections(ORIENTATIONS.HORIZONTAL);
    return [sumCoordinates(origin, left), sumCoordinates(origin, right)];
  } else if (cleanOrientation === ORIENTATIONS.HORIZONTAL) {
    const { up, down } = getOrientationDirections(ORIENTATIONS.VERTICAL);
    return [sumCoordinates(origin, up), sumCoordinates(origin, down)];
  } else throw new Error(`Invalid orientation: ${orientation}`);
};

/**
 * Checks if two coordinates are vertically or horizontally adjacent.
 *
 * @param {number[]} coordinatesOne Coordinate pair to test.
 * @param {number[]} coordinatesTwo Coordinate pair to test.
 * @returns {boolean} True if coordinates are adjacent, false otherwise.
 * @throws {Error} If coordinate pairs are not arrays containing numbers.
 */
const isAdjacent = (coordinatesOne, coordinatesTwo) => {
  const deltaVector = getDelta(coordinatesOne, coordinatesTwo, false);
  return isSingleStepVector(deltaVector);
};

/**
 * Returns the orientation relative to two coordinates.
 *
 * @param {number[]} coordinatesOne First coordinate.
 * @param {number[]} coordinatesTwo Second coordinate.
 * @returns {string} Orientation relative to the two coordinates.
 * @throws {Error} If coordinate pairs are not arrays containing numbers.
 */
const getRelativeOrientation = (coordinatesOne, coordinatesTwo) => {
  const deltaVector = getDelta(coordinatesOne, coordinatesTwo, false);
  if (!isSingleStepVector(deltaVector)) return null;
  return coordinatesOne[0] === coordinatesTwo[0] ? ORIENTATIONS.HORIZONTAL : ORIENTATIONS.VERTICAL;
};

/**
 * Checks if two coordinate pairs are in the same orientation.
 *
 * @param {string} orientation String representing the orientation ('vertical','horizontal').
 * @param {number[]} coordinatesOne Coordinate pair to test.
 * @param {number[]} coordinatesTwo Coordinate pair to test.
 * @returns {boolean} True if coordinate pairs are in the same orientation, false otherwise.
 * @throws {Error} If coordinate pairs are not arrays containing numbers.
 */
const doCoordinatesMatchOrientation = (orientation, coordinatesOne, coordinatesTwo) => {
  validateCoordinates([coordinatesOne, coordinatesTwo]);
  const cleanOrientation = normalizeOrientationString(orientation);
  if (cleanOrientation === ORIENTATIONS.VERTICAL) return isVertical(coordinatesOne, coordinatesTwo);
  if (cleanOrientation === ORIENTATIONS.HORIZONTAL) {
    return isHorizontal(coordinatesOne, coordinatesTwo);
  } else return null;
};

export {
  sumCoordinates,
  isAdjacent,
  isHorizontal,
  isDiagonal,
  doCoordinatesMatchOrientation,
  getRelativeOrientation,
  getPerpendicularCoordinates,
  getDelta,
  getOrientationDirections
};
