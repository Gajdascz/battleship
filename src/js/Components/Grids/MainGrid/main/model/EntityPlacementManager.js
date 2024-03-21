import { STATUSES } from '../../../../../Utility/constants/common';

/**
 * Provides placement management within a 2D Grid array structure.
 * The grid should be structured as an array of rows, with each row being an array of cell objects.
 * Each cell object should at least contain a 'status' property.
 *
 * @param {Object} detail Includes the main grid and a function to check if coordinates are within bounds.
 * @param {array[array[Object]]} mainGrid 2D array representing the grid, where each cell is an object with at least a 'status' property.
 * @param {function} isInBounds Function to check if a given coordinate pair is within the grid bounds.
 * @returns {Object} Methods to manage entity placement within the grid.
 */
export const EntityPlacementManager = ({ mainGrid, isInBounds }) => {
  const placedEntityCoordinates = new Map();
  const isEntityPlaced = (id) => placedEntityCoordinates.has(id);

  /**
   * Determines if a placement is valid or not, based on the specified start and end coordinates.
   * Checks each cell within the rectangular area defined by these coordinates for emptiness.
   *
   * @param {number[]} start Coordinate pair where placement starts ([row, col]).
   * @param {number[]} end Coordinate pair where placement ends ([row, col]).
   * @returns {boolean} True if the placement area is within bounds and all cells are empty, false otherwise.
   */
  const isPlacementValid = (start, end) => {
    if (!isInBounds(start) || !isInBounds(end)) return false;
    for (let row = start[0]; row <= end[0]; ++row) {
      for (let col = start[1]; col <= end[1]; ++col) {
        if (!mainGrid[row][col].status === STATUSES.EMPTY) return false;
      }
    }
    return true;
  };
  /**
   * Removes a placed entity from the grid array.
   *
   * @param {string} entityID Entity identifier.
   */
  const removePlacedEntity = (entityID) => {
    const coordinates = placedEntityCoordinates.get(entityID);
    if (coordinates) {
      coordinates.forEach(([row, col]) => (mainGrid[row][col] = { status: STATUSES.EMPTY }));
      placedEntityCoordinates.delete(entityID);
    }
  };

  /**
   * Places an entity within the specified area of the grid, defined by an array of coordinate pairs.
   * Each cell covered by the area from start to end coordinates is updated to an OCCUPIED status.
   *
   * @param {array[number[]]} coordinates Array of coordinate pairs defining the placement area.
   * @param {string} entityID Unique identifier for the entity being placed.
   * @returns {boolean} True if the entity was successfully placed, false if the placement was invalid.
   */
  const placeEntity = (coordinates, entityID) => {
    const start = coordinates[0];
    const end = coordinates[coordinates.length - 1];
    const entityPlacementCoordinates = [];
    if (isPlacementValid(start, end)) {
      for (let row = start[0]; row <= end[0]; ++row) {
        for (let col = start[1]; col <= end[1]; ++col) {
          const placement = [row, col];
          entityPlacementCoordinates.push(placement);
          mainGrid[row][col] = { status: STATUSES.OCCUPIED, id: entityID };
        }
      }
      placedEntityCoordinates.set(entityID, entityPlacementCoordinates);
      return true;
    } else {
      return false;
    }
  };

  return {
    getPlacedEntityMap: () => placedEntityCoordinates,
    placeEntity,
    removePlacedEntity,
    isEntityPlaced,
    reset: () => placedEntityCoordinates.clear()
  };
};
