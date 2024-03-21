import { STATUSES } from '../../../../Utility/constants/common';

export const AIMainGridModel = (numberOfRows = 10, numberOfCols = 10) => {
  const createGrid = (rows, cols) =>
    Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({ status: STATUSES.EMPTY }))
    );

  let mainGrid = createGrid(numberOfRows, numberOfCols);

  const isInBounds = (row, col) => row >= 0 && row < numberOfRows && col >= 0 && col < numberOfCols;

  const getCell = (row, col) => (isInBounds(row, col) ? mainGrid[row][col] : null);

  const setCellStatus = (row, col, status) => (mainGrid[row][col].status = status);

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

  const processIncomingAttack = (coordinates) => {
    const [row, col] = coordinates;
    const cell = getCell(row, col);
    if (cell.status === STATUSES.OCCUPIED) setCellStatus(row, col, STATUSES.HIT);
    else if (cell.status === STATUSES.EMPTY) setCellStatus(row, col, STATUSES.MISS);
    return { coordinates, cell: getCell(row, col) };
  };

  const reset = () => (mainGrid = createGrid(numberOfRows, numberOfCols));

  return {
    placeShip,
    processIncomingAttack,
    reset,
    getMainGrid: () => mainGrid
  };
};
