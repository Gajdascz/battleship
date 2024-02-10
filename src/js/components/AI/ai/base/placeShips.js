import { ORIENTATIONS, RESULTS } from '../../../utility/constants';

/**
 * Generates a random orientation for ship placement ensuring unpredictability.
 * @returns {string} A random orientation (either VERTICAL or HORIZONTAL).
 */
const getRandomOrientation = () => {
  const orientationChoices = [ORIENTATIONS.VERTICAL, ORIENTATIONS.HORIZONTAL];
  return orientationChoices[Math.floor(Math.random() * orientationChoices.length)];
};

/**
 * Checks if the proposed ship placement is valid within the game grid.
 * @param {number[][]} mainGrid - The game grid represented as a 2D array.
 * @param {array[number[]]} coordinates - An array of coordinates for the ship's placement.
 * @returns {boolean} True if all specified coordinates are null (unoccupied), otherwise false.
 */
const isPlacementValid = (mainGrid, coordinates) =>
  coordinates.every((c) => mainGrid[c[0]][c[1]] === RESULTS.UNEXPLORED);

/**
 * Calculates the starting index for ship placement based on the ending index and ship length.
 * @param {number} placementEnd - The ending index for ship placement.
 * @param {number} shipLength - The length of the ship to be placed.
 * @returns {number} The calculated starting index, ensuring it's within grid bounds.
 */
const getPlacementStart = (placementEnd, shipLength) => Math.max(placementEnd - shipLength + 1, 0);

/**
 * Calculates the end index for ship placement based on starting coordinates, ship length, and grid
 * boundaries.
 * @param {Object} params - Includes start position, ship length, orientation, and grid boundaries.
 * @param {Array<number>} params.placementStart - The starting coordinates for placement.
 * @param {number} params.shipLength - The length of the ship.
 * @param {string} params.orientation - The orientation of the ship (VERTICAL or HORIZONTAL).
 * @param {number} params.maxVertical - Maximum index for vertical placement.
 * @param {number} params.maxHorizontal - Maximum index for horizontal placement.
 * @returns {number} The ending index for ship placement, constrained by grid dimensions.
 */
const getPlacementEnd = ({ placementStart, shipLength, orientation, maxVertical, maxHorizontal }) =>
  orientation === ORIENTATIONS.VERTICAL
    ? Math.min(placementStart[0] + shipLength - 1, maxVertical)
    : Math.min(placementStart[1] + shipLength - 1, maxHorizontal);

/**
 * Generates all grid cells for a ship's placement based on start/end indexes and orientationS.
 * @param {number} start - The start index for placement.
 * @param {number} end - The end index for placement.
 * @param {string} orientation - The orientation of the ship (VERTICAL or HORIZONTAL).
 * @param {number[]} placementStart - The starting coordinates for placement.
 * @returns {array[number[]]} An array of coordinates for each cell of the ship's placement.
 */
const getAllPlacementCells = (start, end, orientation, placementStart) => {
  const cells = [];
  for (let i = start; i <= end; i++) {
    cells.push(
      orientation === ORIENTATIONS.VERTICAL ? [i, placementStart[1]] : [placementStart[0], i]
    );
  }
  return cells;
};

/**
 * Determines the first and last placement cells of the ship based on start/end indexes and
 * orientation.
 * @param {number} start - The starting index of the ship placement.
 * @param {number} end - The ending index of the ship placement.
 * @param {string} orientation - The orientation of the ship (VERTICAL or HORIZONTAL).
 * @param {number[]} placementStart - The starting coordinates for ship placement.
 * @returns {Object} An object containing the coordinates of the first and last placement cells.
 */
const getPlacementFirstAndLastCells = (start, end, orientation, placementStart) => ({
  firstPlacementCell:
    orientation === ORIENTATIONS.VERTICAL ? [start, placementStart[1]] : [placementStart[0], start],
  lastPlacementCell:
    orientation === ORIENTATIONS.VERTICAL ? [end, placementStart[1]] : [placementStart[0], end]
});

/**
 * Places ships on the grid based on the fleet configuration, using a random placement strategy.
 * @param {array[array[]]>} mainGrid - The game grid represented as a 2D array.
 * @param {object[]} fleet - An array of ship objects with properties including length.
 * @param {Function} getRandomMove - Generates random starting cells for ship placement.
 * @param {Function} placeFn - A callback function to execute the placement of a ship.
 * @throws {Error} Throws an error if the placement cannot be completed.
 */
export const placeShips = (mainGrid, fleet, getRandomMove, placeFn) => {
  fleet.forEach((ship) => {
    let placed = false;
    let attempts = 0;
    while (!placed) {
      const startingCell = getRandomMove();
      const orientation = getRandomOrientation();
      const end = getPlacementEnd({
        placementStart: startingCell,
        orientation,
        shipLength: ship.length,
        maxVertical: mainGrid.length - 1,
        maxHorizontal: mainGrid[0].length - 1
      });
      const start = getPlacementStart(end, ship.length);
      const cells = getAllPlacementCells(start, end, orientation, startingCell);
      if (isPlacementValid(mainGrid, cells)) {
        const { firstPlacementCell, lastPlacementCell } = getPlacementFirstAndLastCells(
          start,
          end,
          orientation,
          startingCell
        );
        if (placeFn({ ship, start: firstPlacementCell, end: lastPlacementCell })) placed = true;
      }
      attempts++;
      if (attempts > 250) throw new Error('AI could not find ship placement positions.');
    }
  });
};
