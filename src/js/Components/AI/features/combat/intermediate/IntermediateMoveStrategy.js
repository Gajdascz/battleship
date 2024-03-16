import Queue from '../../../ai/dataStructures/Queue';

export const MoveStrategy = ({ trackingGrid, getOpenMovesAround, getRandomMove, popRandom }) => {
  let _lastHit = null;
  const _getOpenMovesAround = (move) => getOpenMovesAround(trackingGrid, move);
  const hitChain = Queue();
  const priorityMoves = [];

  /**
   * Randomly selects a priority move for a more strategic approach while remaining unpredictable.
   * @returns {number[]|null} - Randomly selected priority move to execute or null if empty.
   */
  const getRandomPriorityMove = () => {
    if (priorityMoves.length === 0) return null;
    return popRandom(priorityMoves);
  };

  /**
   * Empties the current hitChain to process and target surrounding moves.
   */
  const backTrack = () => {
    const hitsFromChain = [];
    while (!hitChain.isEmpty()) hitsFromChain.push(hitChain.dequeue());
    priorityMoves.push(...hitsFromChain.flatMap((hit) => _getOpenMovesAround(hit)));
  };

  /**
   * Processes game and AI lastHit state to provide a strategic move.
   * @returns {number[]} - Coordinates of move to execute.
   */
  const getNextMove = () => {
    if (!_lastHit && priorityMoves.length === 0) return getRandomMove();
    if (priorityMoves.length > 0) return getRandomPriorityMove();
    if (_lastHit) {
      const movesAround = _getOpenMovesAround(_lastHit);
      if (movesAround.length === 0) {
        backTrack();
        return getRandomPriorityMove();
      } else return popRandom(movesAround);
    }
    return getRandomMove();
  };

  return {
    getNextMove,
    getLastHit: () => _lastHit,
    setLastHit: (hit) => {
      hitChain.enqueue(hit);
      _lastHit = hit;
    },
    reset: () => {
      _lastHit = null;
      priorityMoves.length = 0;
      while (!hitChain.isEmpty()) hitChain.dequeue();
    },
    hasPriorityMoves: () => priorityMoves.length !== 0,
    hasHitsInChain: () => !hitChain.isEmpty()
  };
};
