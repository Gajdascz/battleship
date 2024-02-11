import { createGrid } from '../../utility/utils/gridUtils';
import { STATUSES } from '../../utility/constants/common';
export const TrackingGridModel = ({ rows = 10, cols = 10, letterAxis = 'row' } = {}) => {
  if (rows > 26 || cols > 26) throw new Error('Board cannot have more than 25 rows or columns.');

  const _trackingGrid = createGrid(rows, cols, STATUSES.UNEXPLORED);
  const _letterAxis = letterAxis;
  const _maxVertical = _trackingGrid.length;
  const _maxHorizontal = _trackingGrid[0].length;

  return {
    get trackingGrid() {
      return _trackingGrid;
    },
    get letterAxis() {
      return _letterAxis;
    },
    setCellValue: (coordinates, value) => (_trackingGrid[coordinates[0]][coordinates[1]] = value),
    reset() {
      _trackingGrid.length = 0;
      _trackingGrid.push(createGrid(_maxVertical, _maxHorizontal, STATUSES.UNEXPLORED));
    }
  };
};
