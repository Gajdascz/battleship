import { createGrid } from '../../../../Utility/utils/gridUtils';
import { STATUSES } from '../../../../Utility/constants/common';
import { createIdentity } from '../../../../Utility/utils/createIdentity';
export const TrackingGridModel = (gridScope, { rows = 10, cols = 10, letterAxis = 'row' } = {}) => {
  if (rows > 26 || cols > 26) throw new Error('Board cannot have more than 25 rows or columns.');
  const { id, scopedID, scope } = createIdentity({ scope: gridScope, name: 'trackingGrid' });
  const trackingGrid = createGrid(rows, cols, STATUSES.UNEXPLORED);
  const ltrAxis = letterAxis;
  const maxVertical = trackingGrid.length;
  const maxHorizontal = trackingGrid[0].length;

  return {
    getTrackingGrid: () => trackingGrid,
    getLetterAxis: () => ltrAxis,
    getID: () => id,
    getScopedID: () => scopedID,
    getScope: () => scope,
    setCellValue: (coordinates, value) => (trackingGrid[coordinates[0]][coordinates[1]] = value),
    reset() {
      trackingGrid.length = 0;
      trackingGrid.push(createGrid(maxVertical, maxHorizontal, STATUSES.UNEXPLORED));
    }
  };
};
