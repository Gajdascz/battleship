import { copyGrid, isWithinGrid, getValueAt, createGrid } from '../../utility/utils/gridUtils';
import {
  convertToDisplayFormat,
  convertToInternalFormat
} from '../../utility/utils/coordinatesUtils';

import { ORIENTATIONS, STATUSES } from '../../utility/constants/common';

export const MainGridModel = ({ rows = 10, cols = 10, letterAxis = 'row' } = {}) => {
  if (rows > 26 || cols > 26) throw new Error('Board cannot have more than 25 rows or columns.');

  const _mainGrid = createGrid(rows, cols, STATUSES.EMPTY);
  const _letterAxis = letterAxis;
  const _maxVertical = _mainGrid.length;
  const _maxHorizontal = _mainGrid[0].length;
  let _numberOfShipsPlaced = 0;

  const isInBounds = (coordinates) => isWithinGrid(_mainGrid, coordinates);
  const isVertical = (orientation) => orientation === ORIENTATIONS.VERTICAL;

  const getCellStatus = (coordinates) => getValueAt(_mainGrid, coordinates);
  const setCellStatus = (coordinates, status) =>
    (_mainGrid[coordinates[0]][coordinates[1]] = status);

  const isPlacementValid = (start, end, orientation) => {
    if (!isInBounds(start) || !isInBounds(end)) return false;
    if (isVertical(orientation)) {
      for (let i = start[1]; i <= end[1]; i++) {
        const status = getCellStatus([start[0], i]);
        if (status.status !== STATUSES.UNEXPLORED) return false;
      }
    } else {
      for (let i = start[0]; i <= end[0]; i++) {
        const status = getCellStatus([i, start[1]]);
        if (status.status !== STATUSES.UNEXPLORED) return false;
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
  const calculateCells = (startingCoordinatesString, length, orientation) => {
    const cells = [];
    const coordinates = convertToInternalFormat(startingCoordinatesString);
    const startMax = isVertical(orientation)
      ? { max: _maxVertical, startCoordinate: coordinates[1] }
      : { max: _maxHorizontal, startCoordinate: coordinates[0] };
    const { start, end } = getStartEnd(startMax.startCoordinate, length, startMax.max);
    for (let i = start; i <= end; i++) {
      cells.push(convertToDisplayFormat(coordinates[0], coordinates[1], _letterAxis));
    }
    return cells;
  };

  const place = ({ start, end, orientation }) => {
    if (isPlacementValid(start, end, orientation)) {
      if (orientation === ORIENTATIONS.VERTICAL) {
        for (let i = start[1]; i <= end[1]; i++) setCellStatus([start[0], i], STATUSES.OCCUPIED);
      } else {
        for (let i = start[0]; i <= end[0]; i++) setCellStatus([i, start[1]], STATUSES.OCCUPIED);
      }
    } else return false;
    _numberOfShipsPlaced += 1;
    return true;
  };

  function incomingAttack(coordinates) {
    if (!isInBounds(coordinates)) return false;
    const cellStatus = getCellStatus(coordinates);
    if (cellStatus.status === STATUSES.OCCUPIED) {
      setCellStatus(coordinates, STATUSES.HIT);
      return STATUSES.HIT;
    } else return STATUSES.MISS;
  }

  return {
    place,
    incomingAttack,
    isBoard: () => true,
    getMainGrid: () => copyGrid(_mainGrid),
    getLetterAxis: () => _letterAxis,
    getMaxVertical: () => _maxVertical,
    getMaxHorizontal: () => _maxHorizontal,
    getNumberOfShipsPlaced: () => _numberOfShipsPlaced,
    calculateCells,
    reset() {
      _numberOfShipsPlaced = 0;
      _mainGrid.length = 0;
      _mainGrid.push(...createGrid(_maxVertical, _maxHorizontal));
    }
  };
};
