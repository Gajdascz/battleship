import { analyzeClustersForGaps } from './analyzeClustersForGaps';
export const MoveStrategy = ({
  validateFn,
  getNumberOfOpponentShipsLeft,
  gridHelpers,
  sumCoordinates
}) => {
  // Number of ships required to be sunk before analyzing clusters.
  const ANALYZE_CLUSTERS_AT = 3;
  let _clusterLastAnalyzedAt = Infinity;

  const determineMoveStrategy = (getNextInChain, probabilityMap) => {
    const nextInChain = getNextInChain();
    console.log(`nextInChain: ${nextInChain}`);
    if (nextInChain && nextInChain.length > 0) {
      if (Array.isArray(nextInChain[0]))
        return probabilityMap.getHighestProbabilityFromMoves(nextInChain);
      else return nextInChain;
    }

    // const shipsLeft = getNumberOfOpponentShipsLeft();
    // if (shipsLeft <= ANALYZE_CLUSTERS_AT && _clusterLastAnalyzedAt !== shipsLeft) {
    //   const gaps = analyzeClustersForGaps({
    //     gridHelpers,
    //     validateFn,
    //     sumCoordinates
    //   });
    //   console.log(`gaps: ${gaps}`);
    //   _clusterLastAnalyzedAt = shipsLeft;
    //   if (gaps.length > 0) {
    //     probabilityMap.injectGaps(gaps);
    //     probabilityMap.updateState(gridHelpers.copyGrid(), false);
    //     return probabilityMap.getCellWithHighestProbability();
    //   }
    // }
    return probabilityMap.getCellWithHighestProbability();
  };

  const findBestMove = (getNextInChain, probabilityMap, getRandomMove) => {
    const move = determineMoveStrategy(getNextInChain, probabilityMap);
    if (move && validateFn(move)) return move;
    return getRandomMove();
  };

  return {
    findBestMove
  };
};
