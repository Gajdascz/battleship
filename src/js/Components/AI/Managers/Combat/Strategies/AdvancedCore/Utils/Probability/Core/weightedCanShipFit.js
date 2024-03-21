import { STATUSES, ORIENTATIONS } from '../../../../../../../../../Utility/constants/common';
const MAX_ORIENTATIONS = 2;

/**
 * Calculates the 'fitScore' at a target coordinate pair.
 * Score increases for each orientation that the opponents smallest ship can fit in.
 *
 * @param {Object} dependencies
 * @returns
 */
export const weightedCanShipFit = ({
  getCellStatusAt,
  getCellInADirection,
  getOrientationDirections,
  isHitResolved,
  start,
  smallestShipLength
}) => {
  if (getCellStatusAt(start) !== STATUSES.UNEXPLORED) return false;
  let orientationScore = 0;
  const orientations = Object.values(ORIENTATIONS);
  for (const orientation of orientations) {
    let canFit = false;
    const directions = Object.values(getOrientationDirections(orientation));
    for (const direction of directions) {
      let totalSpace = 1; // 1 to account for starting cell.
      let nextCell = getCellInADirection(start, direction);
      while (
        nextCell &&
        getCellStatusAt(nextCell) !== STATUSES.MISS &&
        !(getCellStatusAt(nextCell) === STATUSES.HIT && isHitResolved(nextCell))
      ) {
        totalSpace += 1;
        if (totalSpace >= smallestShipLength) {
          canFit = true;
          break;
        }
        nextCell = getCellInADirection(nextCell, direction);
      }
    }
    if (canFit) orientationScore += 1;
  }
  return orientationScore / MAX_ORIENTATIONS;
};
