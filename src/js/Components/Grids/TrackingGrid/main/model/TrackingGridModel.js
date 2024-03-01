import { createGrid, isWithinGrid, getValueAt } from '../../../../../Utility/utils/gridUtils';
import { STATUSES } from '../../../../../Utility/constants/common';
import { createIdentity } from '../../../../../Utility/utils/createIdentity';

export const TrackingGridModel = (gridScope, { rows = 10, cols = 10, letterAxis = 'row' } = {}) => {
  if (rows > 26 || cols > 26) throw new Error('Board cannot have more than 25 rows or columns.');
  const { id, scopedID, scope } = createIdentity({ scope: gridScope, name: 'trackingGrid' });
  const trackingGrid = createGrid(rows, cols, STATUSES.UNEXPLORED);
  const maxVertical = trackingGrid.length;
  const maxHorizontal = trackingGrid[0].length;

  const isInBounds = (coordinates) => isWithinGrid(trackingGrid, coordinates);

  const getCellStatus = (coordinates) => {
    if (!isInBounds(coordinates)) return;
    return getValueAt(trackingGrid, coordinates);
  };
  const setCellStatus = (coordinates, status) => {
    if (!isInBounds(coordinates)) return;
    trackingGrid[coordinates[0]][coordinates[1]] = status;
  };

  const isValidAttack = (coordinates) => getCellStatus(coordinates) === STATUSES.UNEXPLORED;
  const markCellAsHit = (coordinates) => setCellStatus(coordinates, STATUSES.HIT);
  const markCellAsMiss = (coordinates) => setCellStatus(coordinates, STATUSES.MISS);

  return {
    getTrackingGrid: () => trackingGrid,
    getLetterAxis: () => letterAxis,
    getID: () => id,
    getScopedID: () => scopedID,
    getScope: () => scope,
    isValidAttack,
    markCellAsMiss,
    markCellAsHit,
    reset() {
      trackingGrid.length = 0;
      trackingGrid.push(createGrid(maxVertical, maxHorizontal, STATUSES.UNEXPLORED));
    }
  };
};
