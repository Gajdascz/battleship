import { ORIENTATIONS, STATUSES } from '../../Utility/constants/common';

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

  const getVerticalPlacementCells = (startingCell, endingCoordinate) => {
    const constant = startingCell[1];
    const cells = [];
    for (let i = startingCell[0]; i <= endingCoordinate; i++) cells.push([i, constant]);
    return cells;
  };

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
