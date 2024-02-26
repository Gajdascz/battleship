import { STATUSES } from '../../../../Utility/constants/common';

export const AIMainGridModel = (numberOfRows = 10, numberOfCols = 10) => {
  const createGrid = (rows, cols, fill) =>
    Array.from({ length: rows }).map(() => Array.from({ length: cols }).fill(STATUSES.EMPTY));

  let mainGrid = createGrid(numberOfRows, numberOfCols);

  const isInBounds = (row, col) => row >= 0 && row < numberOfRows && col >= 0 && col < numberOfCols;

  const getCellStatus = (row, col) => (isInBounds(row, col) ? mainGrid[row][col] : null);

  const setCellStatus = (row, col, status) => {
    if (isInBounds(row, col)) {
      mainGrid[row][col] = status;
    }
  };

  const isPlacementValid = (start, end) => {
    for (let row = start[0]; row <= end[0]; ++row) {
      for (let col = start[1]; col <= end[1]; ++col) {
        if (!isInBounds(row, col) || getCellStatus(row, col) !== STATUSES.EMPTY) {
          return false;
        }
      }
    }
    return true;
  };

  const placeShip = (start, end) => {
    if (isPlacementValid(start, end)) {
      for (let row = start[0]; row <= end[0]; ++row) {
        for (let col = start[1]; col <= end[1]; ++col) {
          setCellStatus(row, col, STATUSES.OCCUPIED);
        }
      }
      return true;
    }
    return false;
  };

  const incomingAttack = (row, col) => {
    const status = getCellStatus(row, col);
    if (status === STATUSES.OCCUPIED) {
      setCellStatus(row, col, STATUSES.HIT);
      return STATUSES.HIT;
    } else if (status === STATUSES.EMPTY) {
      setCellStatus(row, col, STATUSES.MISS);
      return STATUSES.MISS;
    }
    return null;
  };

  const resetGrid = () => {
    mainGrid = createGrid(numberOfRows, numberOfCols);
  };

  return {
    placeShip,
    incomingAttack,
    resetGrid,
    getMainGrid: () => mainGrid
  };
};
