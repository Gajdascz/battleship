import { ORIENTATION, RESULTS } from '../../../../utility/constants';

const MAX_ORIENTATIONS = 2;

export const weightedCanShipFit = ({
  getValueAt,
  getCellInADirection,
  getOrientationDirections,
  isHitResolved,
  start,
  smallestShipLength
}) => {
  let orientationScore = 0;
  const orientations = Object.values(ORIENTATION);
  for (const orientation of orientations) {
    let canFit = false;
    const directions = Object.values(getOrientationDirections(orientation));
    for (const direction of directions) {
      let totalSpace = 1; // 1 to account for starting cell.
      let nextCell = getCellInADirection(start, direction);
      while (
        nextCell &&
        getValueAt(nextCell) !== RESULTS.MISS &&
        !(getValueAt(nextCell) === RESULTS.HIT && isHitResolved(nextCell))
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
