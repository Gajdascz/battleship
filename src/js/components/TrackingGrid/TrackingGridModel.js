import { createGrid } from '../../utility/utils/gridUtils';
import { STATUSES } from '../../utility/constants/common';
import { generateRandomID } from '../../utility/utils/stringUtils';
export const TrackingGridModel = ({ rows = 10, cols = 10, letterAxis = 'row', id = null } = {}) => {
  if (rows > 26 || cols > 26) throw new Error('Board cannot have more than 25 rows or columns.');

  const _id = id ?? generateRandomID();
  const _trackingGrid = createGrid(rows, cols, STATUSES.UNEXPLORED);
  const _letterAxis = letterAxis;
  const _maxVertical = _trackingGrid.length;
  const _maxHorizontal = _trackingGrid[0].length;

  return {
    getTrackingGrid: () => _trackingGrid,
    getLetterAxis: () => _letterAxis,
    getID: () => _id,
    setCellValue: (coordinates, value) => (_trackingGrid[coordinates[0]][coordinates[1]] = value),
    reset() {
      _trackingGrid.length = 0;
      _trackingGrid.push(createGrid(_maxVertical, _maxHorizontal, STATUSES.UNEXPLORED));
    }
  };
};
