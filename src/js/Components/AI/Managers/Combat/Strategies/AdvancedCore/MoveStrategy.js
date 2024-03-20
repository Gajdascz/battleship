export const MoveStrategy = (validateFn) => {
  const determineMoveStrategy = (getNextInChain, probabilityMap) => {
    const nextInChain = getNextInChain();
    if (nextInChain && nextInChain.length > 0) {
      if (Array.isArray(nextInChain[0]))
        return probabilityMap.getHighestProbabilityFromMoves(nextInChain);
      else return nextInChain;
    }
    return probabilityMap.getCellWithHighestProbability();
  };

  const findBestMove = (getNextInChain, probabilityMap, getRandomMove) => {
    const move = determineMoveStrategy(getNextInChain, probabilityMap);
    if (move && validateFn(move)) return move;
    return getRandomMove();
  };

  return findBestMove;
};
