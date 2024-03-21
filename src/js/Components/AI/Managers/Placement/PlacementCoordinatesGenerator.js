import { ORIENTATIONS, STATUSES } from '../../../../Utility/constants/common';
/**
 * Provides the AI with a random set of coordinates to place ships at.
 *
 * @param {array[number]} gridArray 2D array representing a grid structure.
 * @returns {Object} Methods to generate coordinates and set the grid.
 */
export const PlacementCoordinatesGenerator = (gridArray) => {
  const copyGrid = (grid) =>
    grid.map((row) => Array.from({ length: row.length }).fill(STATUSES.EMPTY));
  let grid = copyGrid(gridArray);
  let rows = grid.length;
  let cols = grid[0].length;
  const refreshGrid = () => (grid = grid.map((row) => row.map(() => STATUSES.EMPTY)));

  const getRandomOrientation = () => {
    const orientationChoices = [ORIENTATIONS.VERTICAL, ORIENTATIONS.HORIZONTAL];
    return orientationChoices[Math.floor(Math.random() * orientationChoices.length)];
  };

  const isPlacementValid = (coordinates) =>
    coordinates.every(([x, y]) => x < rows && y < cols && grid[x][y] === STATUSES.EMPTY);

  /**
   * Calculates placement cells in the vertical orientation
   *
   * @param {number[]} startingCell Coordinates to start placement at.
   * @param {number[]} endingCoordinate Coordinates to end placement at.
   * @returns {array[number[]]} Array of coordinates.
   */
  const getVerticalPlacementCells = (startingCell, endingCoordinate) => {
    const constant = startingCell[1];
    const cells = [];
    for (let i = startingCell[0]; i <= endingCoordinate; i++) cells.push([i, constant]);
    return cells;
  };
  /**
   * Calculates placement cells in the horizontal orientation
   *
   * @param {number[]} startingCell Coordinates to start placement at.
   * @param {number[]} endingCoordinate Coordinates to end placement at.
   * @returns {array[number[]]} Array of coordinates.
   */
  const getHorizontalPlacementCells = (startingCell, endingCoordinate) => {
    const constant = startingCell[0];
    const cells = [];
    for (let i = startingCell[1]; i <= endingCoordinate; i++) cells.push([constant, i]);
    return cells;
  };

  const getAllPlacementCells = (startingCell, orientation, shipLength) => {
    if (orientation === ORIENTATIONS.VERTICAL)
      return getVerticalPlacementCells(startingCell, startingCell[0] + shipLength - 1);
    else return getHorizontalPlacementCells(startingCell, startingCell[1] + shipLength - 1);
  };

  const getRandomStartingCoordinates = () => {
    const coordinates = [Math.floor(Math.random() * rows), Math.floor(Math.random() * cols)];
    if (!(grid[coordinates[0]][coordinates[1]] === STATUSES.EMPTY))
      return getRandomStartingCoordinates();
    return coordinates;
  };

  const occupyCells = (cells) => {
    cells.forEach((cell) => (grid[cell[0]][cell[1]] = STATUSES.OCCUPIED));
  };

  const getRandomShipPlacement = (shipLength) => {
    let attempts = 0;
    while (attempts < 250) {
      const orientation = getRandomOrientation();
      const startingCell = getRandomStartingCoordinates();
      const cells = getAllPlacementCells(startingCell, orientation, shipLength);
      if (isPlacementValid(cells)) {
        occupyCells(cells);
        return cells;
      }
      attempts++;
    }
    throw new Error(`Failed to place ship after ${attempts} attempts`);
  };

  /**
   * Calculates a random placement coordinates for each ship within the fleet.
   *
   * @param {Object[]} fleet Array of ship data objects.
   * @returns {array[Object[]]} Array of Ship id's and placement coordinates.
   */
  const calculateRandomShipPlacements = (fleet) => {
    const placements = [];
    fleet.forEach((ship) => {
      const placement = getRandomShipPlacement(ship.length);
      placements.push({ id: ship.id, placement });
    });
    refreshGrid();
    return placements;
  };

  return {
    calculateRandomShipPlacements,
    updateGrid: (newGridArray) => {
      grid = copyGrid(newGridArray);
      rows = grid.length;
      cols = grid[0].length;
    }
  };
};
