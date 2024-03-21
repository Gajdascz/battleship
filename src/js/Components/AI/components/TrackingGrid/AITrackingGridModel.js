import { STATUSES } from '../../../../Utility/constants/common';

export const AITrackingGridModel = (numberOfRows = 10, numberOfCols = 10) => {
  const createGrid = (rows, cols) =>
    Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({ status: STATUSES.UNEXPLORED }))
    );
  let trackingGrid = createGrid(numberOfRows, numberOfCols);

  const setCellStatus = (coordinates, status) => {
    const [row, col] = coordinates;
    trackingGrid[row][col].status = status;
  };

  return {
    getTrackingGrid: () => trackingGrid,
    setCellStatus,
    reset: () => (trackingGrid = createGrid(numberOfRows, numberOfCols))
  };
};
