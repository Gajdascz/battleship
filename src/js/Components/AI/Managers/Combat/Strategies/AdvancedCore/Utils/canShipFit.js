import { STATUSES, ORIENTATIONS } from '../../../../../../../Utility/constants/common';

export const canShipFit = ({
  getCellStatusAt,
  getCellInADirection,
  getOrientationDirections,
  isHitResolved,
  start,
  smallestShipLength
}) => {
  if (getCellStatusAt(start) !== STATUSES.UNEXPLORED) return false;
  const orientations = Object.values(ORIENTATIONS);
  for (const orientation of orientations) {
    let totalSpace = 1; // 1 to account for starting cell.
    const directions = Object.values(getOrientationDirections(orientation));
    for (const direction of directions) {
      let nextCell = getCellInADirection(start, direction);
      while (
        nextCell &&
        getCellStatusAt(nextCell) !== STATUSES.MISS &&
        !(getCellStatusAt(nextCell) === STATUSES.HIT && isHitResolved(nextCell))
      ) {
        totalSpace += 1;
        if (totalSpace >= smallestShipLength) return true;
        nextCell = getCellInADirection(nextCell, direction);
      }
    }
  }
  return false;
};
