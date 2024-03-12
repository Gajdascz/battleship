import { STATUSES } from '../../../../Utility/constants/common';

export const AITrackingGridModel = (numberOfRows = 10, numberOfCols = 10) => {
  const createGrid = (rows, cols) =>
    Array.from({ length: rows }).map(() =>
      Array.from({ length: cols }).fill({ status: STATUSES.UNEXPLORED })
    );
  let trackingGrid = createGrid(numberOfRows, numberOfCols);

  return {
    getTrackingGrid: () => trackingGrid,
    setCellValue: (coordinates, value) => (trackingGrid[coordinates[0]][coordinates[1]] = value),
    reset: () => (trackingGrid = createGrid(numberOfRows, numberOfCols))
  };
};
