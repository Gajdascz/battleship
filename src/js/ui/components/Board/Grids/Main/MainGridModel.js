import { GRIDS } from '../../../../common/constants/gridConstants';
import { copyGrid, isWithinGrid } from '../../../../../utility/utils/gridUtils';
import {
  convertToDisplayFormat,
  convertToInternalFormat,
  getDelta,
  isDiagonal,
  isHorizontal
} from '../../../../../utility/utils/coordinatesUtils';

export const MainGridModel = ({ rows = 10, cols = 10, letterAxis = 'row' } = {}) => {
  if (rows > 26 || cols > 26) throw new Error('Board cannot have more than 25 rows or columns.');

  const createGrid = (rows, cols, fill = null) =>
    Array.from({ length: rows }).map(() => Array.from({ length: cols }).fill(fill));

  const _mainGrid = createGrid(rows, cols);
  const _letterAxis = letterAxis;
  const _ships = [];
  const _maxVertical = _mainGrid.length;
  const _maxHorizontal = _mainGrid[0].length;
  const _selectedShip = { id: null, length: null, orientation: null };

  let _lastShipSunk = null;
  const isInBounds = (coordinates) => isWithinGrid(_mainGrid, coordinates);
  const hasValidLength = (start, end, length) => getDelta(end, start, false).includes(length - 1);

  const isPlacementValid = (start, end, isPlacedHorizontally, shipLength) => {
    if (
      !isInBounds(start) ||
      !isInBounds(end) ||
      !hasValidLength(start, end, shipLength) ||
      isDiagonal(start, end)
    )
      return false;
    if (isPlacedHorizontally) {
      for (let i = start[1]; i <= end[1]; i++) {
        if (_mainGrid[start[0]][i] !== GRIDS.RESULTS.UNEXPLORED) return false;
      }
    } else {
      for (let i = start[0]; i <= end[0]; i++) {
        if (_mainGrid[i][start[1]] !== GRIDS.RESULTS.UNEXPLORED) return false;
      }
    }
    return true;
  };

  /**
   * Dynamically calculates the valid cells a ship can occupy.
   * Keeps all placement cells within the bounds of the grid.
   *
   * @param {number} start Starting cell row or column.
   * @param {number} length Selected Ship's length.
   * @param {number} max Grid's maximum row or column.
   * @returns {object} Starting and Ending row or column.
   */
  const getStartEnd = (start, length, max) => {
    const end = Math.min(start + length - 1, max);
    return {
      start: Math.max(end - length + 1, 0),
      end
    };
  };

  /**
   * Calculates and returns a list of cells for placement preview based on the starting cell and ship orientation.
   * It considers the ship's orientation (vertical/horizontal) and length to determine which cells will be occupied.
   * @param {string} startingCoordinates - String representation of the cell coordinates where the preview starts.
   * @returns {array} - Array of valid cells for preview.
   */
  const calculateCells = (startingCoordinatesString) => {
    const cells = [];
    const coordinates = convertToInternalFormat(startingCoordinatesString);
    const isVertical = _selectedShip.orientation === GRIDS.COMMON.ORIENTATIONS.VERTICAL;
    const max = isVertical ? _maxVertical : _maxHorizontal;
    const startCoordinate = isVertical ? coordinates[0] : coordinates[1];
    const { start, end } = getStartEnd(startCoordinate, _selectedShip.length, max);
    for (let i = start; i <= end; i++) {
      cells.push(convertToDisplayFormat(coordinates[0], coordinates[1], _letterAxis));
    }
    return cells;
  };

  const place = ({ ship, start, end }) => {
    const isPlacedHorizontally = isHorizontal(start, end);
    if (isPlacementValid(start, end, isPlacedHorizontally, ship.length)) {
      if (isHorizontal(start, end)) {
        for (let i = start[1]; i <= end[1]; i++) _mainGrid[start[0]][i] = ship;
      } else {
        for (let i = start[0]; i <= end[0]; i++) _mainGrid[i][start[1]] = ship;
      }
    } else return false;

    _ships.push(ship);
    return true;
  };

  const setCellValue = (coordinates, value) => (_mainGrid[coordinates[0]][coordinates[1]] = value);

  function incomingAttack(coordinates) {
    if (!isInBounds(coordinates)) return false;
    const gridCell = _mainGrid[coordinates[0]][coordinates[1]];
    if (gridCell?.isShip() && gridCell.hit()) {
      setCellValue(_mainGrid, coordinates, GRIDS.RESULTS.HIT);
      if (gridCell.isSunk()) {
        _lastShipSunk = gridCell.id;
        return GRIDS.RESULTS.SHIP_SUNK;
      } else return GRIDS.RESULTS.HIT;
    } else return GRIDS.RESULTS.MISS;
  }

  return {
    place,
    incomingAttack,
    isAllShipsSunk: () => _ships.every((ship) => ship.isSunk()),
    isBoard: () => true,
    getNumberOfShipsPlaced: () => _ships.length,
    getMainGrid: () => copyGrid(_mainGrid),
    getLetterAxis: () => _letterAxis,
    getLastShipSunk: () => _lastShipSunk,
    getMaxVertical: () => _maxVertical,
    getMaxHorizontal: () => _maxHorizontal,
    setSelectedShip: (id, length, orientation) => {
      _selectedShip.id = id;
      _selectedShip.length = length;
      _selectedShip.orientation = orientation;
    },
    updateSelectedShipOrientation: (value) => (_selectedShip.orientation = value),
    calculateCells,
    reset() {
      _ships.length = 0;
      _mainGrid.length = 0;
      _mainGrid.push(...createGrid(_maxVertical, _maxHorizontal));
      _selectedShip.id = null;
      _selectedShip.length = null;
      _selectedShip.orientation = null;
      _lastShipSunk = null;
    }
  };
};
