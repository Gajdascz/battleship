import { copyGrid, isWithinGrid, getValueAt, createGrid } from '../../utility/utils/gridUtils';
import { LETTER_AXES, ORIENTATIONS, STATUSES } from '../../utility/constants/common';
import { generateRandomID } from '../../utility/utils/stringUtils';

export const MainGridModel = ({
  numberOfRows = 10,
  numberOfCols = 10,
  letterAxis = LETTER_AXES.ROW,
  id = null
} = {}) => {
  if (numberOfRows > 26 || numberOfCols > 26)
    throw new Error('Board cannot have more than 25 rows or columns.');

  const _id = id ?? generateRandomID();
  const _mainGrid = createGrid(numberOfRows, numberOfCols, STATUSES.EMPTY);
  const _letterAxis = letterAxis;
  const _maxVertical = _mainGrid.length - 1;
  const _maxHorizontal = _mainGrid[0].length - 1;
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
    getID: () => _id,
    reset() {
      _numberOfShipsPlaced = 0;
      _mainGrid.length = 0;
      _mainGrid.push(...createGrid(_maxVertical, _maxHorizontal));
    }
  };
};
