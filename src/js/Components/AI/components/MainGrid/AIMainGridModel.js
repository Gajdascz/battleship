import { STATUSES } from '../../../../Utility/constants/common';

export const AIMainGridModel = (numberOfRows = 10, numberOfCols = 10) => {
  const createGrid = (rows, cols, fill) =>
    Array.from({ length: rows }).map(() =>
      Array.from({ length: cols }).fill({ status: STATUSES.EMPTY })
    );

  let mainGrid = createGrid(numberOfRows, numberOfCols);

  const isInBounds = (row, col) => row >= 0 && row < numberOfRows && col >= 0 && col < numberOfCols;

  const getCell = (row, col) => (isInBounds(row, col) ? mainGrid[row][col] : null);

  const setCellStatus = (row, col, status) => {
    if (isInBounds(row, col)) {
      mainGrid[row][col].status = status;
    }
  };

  const isPlacementValid = (start, end) => {
    for (let row = start[0]; row <= end[0]; ++row) {
      for (let col = start[1]; col <= end[1]; ++col) {
        if (!isInBounds(row, col) || getCell(row, col).status !== STATUSES.EMPTY) {
          return false;
        }
      }
    }
    return true;
  };

  const placeShip = (id, start, end) => {
    console.log(id, start, end);
    if (isPlacementValid(start, end)) {
      for (let row = start[0]; row <= end[0]; ++row) {
        for (let col = start[1]; col <= end[1]; ++col) {
          mainGrid[row][col] = { status: STATUSES.OCCUPIED, id };
        }
      }
      return true;
    }
    return false;
  };

  const processIncomingAttack = (row, col) => {
    const cell = getCell(row, col);
    if (cell.status === STATUSES.OCCUPIED) {
      setCellStatus(row, col, STATUSES.HIT);
      return STATUSES.HIT;
    } else if (cell.status === STATUSES.EMPTY) {
      setCellStatus(row, col, STATUSES.MISS);
      return cell;
    }
    return null;
  };

  const resetGrid = () => {
    mainGrid = createGrid(numberOfRows, numberOfCols);
  };

  return {
    placeShip,
    processIncomingAttack,
    resetGrid,
    getMainGrid: () => mainGrid
  };
};
