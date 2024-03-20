import {
  sumCoordinates,
  getDelta
} from '../../../../../../../../../Utility/utils/coordinatesUtils';
import { STATUSES } from '../../../../../../../../../Utility/constants/common';

const MISS_VALUE = 0.2;
const UNRESOLVED_HIT_VALUE = 2;
const BASE_VALUE = 0.33;
const NUMBER_OF_ADJACENT_DIRECTIONS = 4;

export const calculateAdjacencyScore = (
  move,
  { getCellsInAllDirections, getCellStatusAt, isHitResolved }
) => {
  let score = 0;

  const getUnresolvedHitsScore = (cell) => {
    let unresolvedHitsScore = 0;
    const direction = getDelta(move, cell);
    let currentCell = cell;
    let currentCellStatus = getCellStatusAt(currentCell);
    while (currentCellStatus && currentCellStatus === STATUSES.HIT && !isHitResolved(currentCell)) {
      unresolvedHitsScore += UNRESOLVED_HIT_VALUE;
      currentCell = sumCoordinates(currentCell, direction);
      currentCellStatus = getCellStatusAt(currentCell);
    }
    return unresolvedHitsScore;
  };
  const adjacentCells = getCellsInAllDirections(move);
  score = (NUMBER_OF_ADJACENT_DIRECTIONS - adjacentCells.length) * BASE_VALUE;
  adjacentCells.forEach((cell) => {
    const cellStatus = getCellStatusAt(cell);
    if (cellStatus === STATUSES.MISS) score -= MISS_VALUE;
    else if (cellStatus === STATUSES.HIT && !isHitResolved(cell)) {
      score += getUnresolvedHitsScore(cell);
    } else score += BASE_VALUE;
  });
  return score / NUMBER_OF_ADJACENT_DIRECTIONS;
};
