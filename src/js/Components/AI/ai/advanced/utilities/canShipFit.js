import { ORIENTATIONS, RESULTS } from '../../../../Utility/constants';

export const canShipFit = ({
  getValueAt,
  getCellInADirection,
  getOrientationDirections,
  isHitResolved,
  start,
  getSmallestShipLength
}) => {
  const smallestShipLength = getSmallestShipLength();
  const orientations = Object.values(ORIENTATIONS);
  for (const orientation of orientations) {
    let totalSpace = 1; // 1 to account for starting cell.
    const directions = Object.values(getOrientationDirections(orientation));
    for (const direction of directions) {
      let nextCell = getCellInADirection(start, direction);
      while (
        nextCell &&
        getValueAt(nextCell) !== RESULTS.MISS &&
        !(getValueAt(nextCell) === RESULTS.HIT && isHitResolved(nextCell))
      ) {
        totalSpace += 1;
        if (totalSpace >= smallestShipLength) return true;
        nextCell = getCellInADirection(nextCell, direction);
      }
    }
  }
  return false;
};
