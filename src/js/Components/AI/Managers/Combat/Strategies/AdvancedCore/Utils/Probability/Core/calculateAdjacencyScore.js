import {
  sumCoordinates,
  getDelta
} from '../../../../../../../../../Utility/utils/coordinatesUtils';
import { STATUSES } from '../../../../../../../../../Utility/constants/common';

const MISS_VALUE = 0.2;
const UNRESOLVED_HIT_VALUE = 2;
const UNEXPLORED_VALUE = 0.33;
const NUMBER_OF_ADJACENT_DIRECTIONS = 4;

export const calculateAdjacencyScore = (
  move,
  { getCellsInAllDirections, getCellStatusAt, isHitResolved }
) => {
  let unresolvedScore = 0;
  let missScore = 0;
  let unexploredScore = 0;
  const adjacentCells = getCellsInAllDirections(move);
  adjacentCells.forEach((cell) => {
    const cellStatus = getCellStatusAt(cell);
    if (cellStatus === STATUSES.MISS) missScore += MISS_VALUE;
    else if (cellStatus === STATUSES.HIT && !isHitResolved(cell)) {
      const direction = getDelta(move, cell);
      let currentCell = cell;
      let currentCellStatus = getCellStatusAt(currentCell);
      while (
        currentCellStatus &&
        currentCellStatus === STATUSES.HIT &&
        !isHitResolved(currentCell)
      ) {
        unresolvedScore += UNRESOLVED_HIT_VALUE;
        currentCell = sumCoordinates(currentCell, direction);
        currentCellStatus = getCellStatusAt(currentCell);
      }
    } else if (cellStatus === STATUSES.UNEXPLORED) unexploredScore += UNEXPLORED_VALUE;
  });
  return (unresolvedScore + unexploredScore - missScore) / NUMBER_OF_ADJACENT_DIRECTIONS;
};
