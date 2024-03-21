import Queue from '../../../../../Utility/dataStructures/Queue';
import { getOpenMovesAround } from '../../../../../Utility/utils/gridUtils';
import { popRandom } from '../../../../../Utility/utils/arrayUtils';
import { STATUSES } from '../../../../../Utility/constants/common';

/**
 * Provides AI intermediate move strategy.
 * Tracks last successful hit and targets surrounding area until a ship is sunk.
 *
 * @param {Object} detail Data for initializing strategy.
 * @param {number[]} trackingGrid 2D array for tracking attacks and results.
 * @param {function} popRandomMove Function for retrieving random move from availableMoves.
 * @param {function} popMove Function for retrieving specific move from availableMoves.
 * @returns {Object} Interface for AI to utilize intermediate strategy.
 */
export const IntermediateMoveStrategy = ({ trackingGrid, popRandomMove, popMove }) => {
  let lastHit = null;
  const hitChain = Queue();
  const priorityMoves = [];

  /**
   * Randomly selects a priority move for a more strategic approach while remaining unpredictable.
   *
   * @returns {number[]|null} - Randomly selected priority move to execute or null if empty.
   */
  const getRandomPriorityMove = () => {
    while (priorityMoves.length > 0) {
      const move = popMove(popRandom(priorityMoves));
      if (move) return move;
    }
    return null;
  };

  /**
   * Empties the current hitChain to process and target surrounding moves.
   */
  const backTrack = () => {
    lastHit = null;
    priorityMoves.length = 0;
    const hitsFromChain = [];
    while (!hitChain.isEmpty()) hitsFromChain.push(hitChain.dequeue());
    priorityMoves.push(...hitsFromChain.flatMap((hit) => getOpenMovesAround(trackingGrid, hit)));
    const move = getRandomPriorityMove();
    if (move) return move;
    else return getNextMove();
  };

  /**
   * Processes game and AI lastHit state to provide a strategic move.
   * @returns {number[]} - Coordinates of move to execute.
   */
  const getNextMove = () => {
    if (!lastHit) {
      if (priorityMoves.length === 0) return popRandomMove();
      else return getRandomPriorityMove();
    }
    if (lastHit) {
      const movesAround = getOpenMovesAround(trackingGrid, lastHit);
      if (movesAround.length > 0) return popMove(popRandom(movesAround));
      else return backTrack();
    }
  };

  /**
   * Processed result of sent attack for strategic planning.
   *
   * @param {number[]} coordinates Coordinates of attack result.
   * @param {string} result String representation of attack result.
   */
  const processMoveResult = (coordinates, result) => {
    if (result === STATUSES.MISS);
    else if (result === STATUSES.HIT) {
      hitChain.enqueue(coordinates);
      lastHit = coordinates;
    } else if (result === STATUSES.SHIP_SUNK) reset();
  };

  const reset = () => {
    lastHit = null;
    priorityMoves.length = 0;
    while (!hitChain.isEmpty()) hitChain.dequeue();
  };

  return {
    getNextMove,
    processMoveResult,
    getLastHit: () => lastHit,
    setLastHit: (hit) => {
      hitChain.enqueue(hit);
      lastHit = hit;
    },
    reset: () => {
      lastHit = null;
      priorityMoves.length = 0;
      while (!hitChain.isEmpty()) hitChain.dequeue();
    },
    hasPriorityMoves: () => priorityMoves.length !== 0,
    hasHitsInChain: () => !hitChain.isEmpty()
  };
};
