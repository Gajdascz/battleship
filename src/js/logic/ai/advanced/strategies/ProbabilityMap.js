import { RESULTS } from '../../../../utility/constants';
import { getDelta, sumCoordinates } from '../../utilities/coordinatesHelpers';
import { weightedCanShipFit } from './weightedCanShipFit';
export const ProbabilityMap = ({
  initialGrid,
  gridHelpers,
  getOrientationDirections,
  isHitResolved,
  getSmallestShipLength,
  validateFn
}) => {
  const NUMBER_OF_ADJACENT_DIRECTIONS = 4;

  const ILLOGICAL_CELL_VALUE = -1;
  const UNRESOLVED_HIT_VALUE = 2;
  const MISS_VALUE = 0.2;
  const UNEXPLORED_VALUE = 0.33;
  const CAN_FIT_VALUE = 0.25;

  const round = (score) => Math.round(score * 100) / 100;

  const _probabilityMap = initialGrid.map((row) => row.map(() => 0));

  let _smallestShipLength = getSmallestShipLength();

  const getFitScore = (move) =>
    weightedCanShipFit({
      getValueAt: gridHelpers.getValueAt,
      getCellInADirection: gridHelpers.getCellInADirection,
      getOrientationDirections,
      isHitResolved,
      start: move,
      smallestShipLength: _smallestShipLength
    });

  const getAdjacencyScore = (move) => {
    let unresolvedScore = 0;
    let missScore = 0;
    let unexploredScore = 0;
    const adjacentCells = gridHelpers.getCellsInAllDirections(move);
    adjacentCells.forEach((cell) => {
      const cellValue = gridHelpers.getValueAt(cell);
      if (cellValue === RESULTS.MISS) missScore += MISS_VALUE;
      else if (cellValue === RESULTS.HIT && !isHitResolved(cell)) {
        const direction = getDelta(move, cell);
        let currentCell = cell;
        let currentValue = gridHelpers.getValueAt(currentCell);
        while (currentValue && currentValue === RESULTS.HIT && !isHitResolved(currentCell)) {
          unresolvedScore += UNRESOLVED_HIT_VALUE;
          currentCell = sumCoordinates(currentCell, direction);
          currentValue = gridHelpers.getValueAt(currentCell);
        }
      } else if (cellValue === RESULTS.UNEXPLORED) unexploredScore += UNEXPLORED_VALUE;
    });
    return (unresolvedScore + unexploredScore - missScore) / NUMBER_OF_ADJACENT_DIRECTIONS;
  };

  const calculateProbabilityScore = (coordinates) => {
    if (!validateFn(coordinates)) return ILLOGICAL_CELL_VALUE;
    let score = CAN_FIT_VALUE;
    score += getFitScore(coordinates);
    score += getAdjacencyScore(coordinates);
    score = round(score);
    return score;
  };

  const assessCellProbabilities = (grid) => {
    grid.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        const coordinates = [rowIndex, colIndex];
        const score = calculateProbabilityScore(coordinates);
        _probabilityMap[rowIndex][colIndex] = score;
      });
    });
  };

  const getCellWithHighestProbability = () => {
    let highestScore = -Infinity;
    const highestScoringCells = [];
    _probabilityMap.forEach((row, rowIndex) => {
      row.forEach((score, colIndex) => {
        const coordinates = [rowIndex, colIndex];
        if (score !== ILLOGICAL_CELL_VALUE && score > highestScore) {
          highestScore = score;
          highestScoringCells.length = 0;
          highestScoringCells.push(coordinates);
        } else if (score === highestScore) highestScoringCells.push(coordinates);
      });
    });
    if (highestScoringCells.length > 1) {
      return highestScoringCells[Math.floor(Math.random() * highestScoringCells.length)];
    }
    return highestScoringCells.length > 0 ? highestScoringCells[0] : null;
  };

  const getHighestProbabilityFromMoves = (moves) =>
    moves
      .map((move) => ({
        move,
        score: calculateProbabilityScore(move)
      }))
      .filter((result) => result.score >= 0)
      .sort((a, b) => b.score - a.score)[0].move;

  const getHitWithHighestSurroundingProbability = (hits) => {
    const hitsAndOpen = [];
    hits.forEach((hit) => {
      const openAround = gridHelpers.getOpenMovesAround(hit);
      const score = openAround.reduce(
        (acc, openCell) => acc + calculateProbabilityScore(openCell),
        0
      );
      hitsAndOpen.push({ cell: hit, score });
    });
    hitsAndOpen.sort((a, b) => b.score - a.score);
    return hitsAndOpen[0].cell;
  };

  return {
    getCellWithHighestProbability,
    calculateProbabilityScore,
    getHighestProbabilityFromMoves,
    getHitWithHighestSurroundingProbability,
    updateState: (grid, shipSunk = false) => {
      if (shipSunk) _smallestShipLength = getSmallestShipLength();
      assessCellProbabilities(grid);
    }
  };
};
// const reassessGaps = () => (_gaps = _gaps.filter(validateFn));

// const checkForGapScore = (move) => {
//   const isGap = _gaps.some((gap) => gap[0] === move[0] && gap[1] === move[1]);
//   return isGap ? GAP_VALUE : 0;
// };    // if (_gaps.length > 0) {
//   reassessGaps();
//   score += checkForGapScore(coordinates);
// injectGaps: (gaps) => _gaps.push(...gaps),
//    if (_gaps.length > 0) reassessGaps();
// }
//      _theoreticalMaximum = calculateTheoreticalFitScoreMaximum();
/**
 * Normalized Fit Score Logic:
 *  -> The cell being analyzed has unresolved hits in all 4 directions.
 *  -> Each ship connected to the adjacent unresolved hit is 1 hit away from being resolved.
 *  -> The unresolved hit is the furthest away from the center cell.
 *  -> There are four adjacent directions so account for the 4 largest ships.
 *  -> The ship will fit in both orientations so start with a base score of 2.
 *  -> Maximum unresolved hits = 2 + (shipLength_n - 1) + (shipLength_n - 1) + ...
 */
// const calculateTheoreticalFitScoreMaximum = () => {
//   const largestConsideredShips = [...getLiveOpponentShipLengths()]
//     .sort((a, b) => b - a)
//     .slice(0, MAX_SHIPS_CONSIDERED);
//   const totalPossibleUnresolvedHits = largestConsideredShips.reduce(
//     (acc, shipLength) => acc + (shipLength - 1),
//     0
//   );
//   console.log(`ships: ${largestConsideredShips} | totalPoss: ${totalPossibleUnresolvedHits}`);
//   return totalPossibleUnresolvedHits + MAX_ORIENTATION_SCORE;
// };
// const MAX_SHIPS_CONSIDERED = NUMBER_OF_ADJACENT_DIRECTIONS;
// const GAP_VALUE = 0.5;

// let _gaps = [];
