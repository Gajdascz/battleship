import { weightedCanShipFit } from './Core/weightedCanShipFit';
import { calculateAdjacencyScore } from './Core/calculateAdjacencyScore';
export const ProbabilityMap = ({
  initialGrid,
  gridHelpers,
  getOrientationDirections,
  isHitResolved,
  getSmallestShipLength,
  validateFn
}) => {
  const ILLOGICAL_CELL_VALUE = -1;
  const CAN_FIT_VALUE = 0.25;

  const probabilityMap = initialGrid.map((row) => row.map(() => 0));
  let smallestShipLength = getSmallestShipLength();

  const { getCellStatusAt, getCellInADirection, getCellsInAllDirections, getOpenMovesAround } =
    gridHelpers;

  const round = (score) => Math.round(score * 100) / 100;

  const getFitScore = (move) =>
    weightedCanShipFit({
      getCellStatusAt,
      getCellInADirection,
      getOrientationDirections,
      isHitResolved,
      start: move,
      smallestShipLength
    });

  const getAdjacencyScore = (move) =>
    calculateAdjacencyScore(move, {
      getCellsInAllDirections,
      getCellStatusAt,
      isHitResolved
    });

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
        probabilityMap[rowIndex][colIndex] = score;
      });
    });
  };

  const getCellWithHighestProbability = () => {
    let highestScore = -Infinity;
    const highestScoringCells = [];
    probabilityMap.forEach((row, rowIndex) => {
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
      const openAround = getOpenMovesAround(hit);
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
      if (shipSunk) smallestShipLength = getSmallestShipLength();
      assessCellProbabilities(grid);
    }
  };
};
