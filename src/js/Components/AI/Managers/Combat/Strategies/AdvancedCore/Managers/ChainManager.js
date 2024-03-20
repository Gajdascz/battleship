import { ORIENTATIONS } from '../../../../../../../Utility/constants/common';
import Queue from '../../../../../../../Utility/dataStructures/Queue';
import { areCoordinatesEqual } from '../../../../../../../Utility/utils/coordinatesUtils';
import Chain from '../Chain';

/**
 * Initializes a ChainManager for strategically processing and utilizing the Chain structure.
 *
 * @param {Object} detail Initialization dependencies.
 * @returns {Object} Interface for strategically utilizing the Chain.
 */
export const ChainManager = ({
  validateFn,
  sumCoordinates,
  getOpenMovesAround,
  getHighestProbabilityFromMoves,
  hitsManager
}) => {
  const currentChain = { chain: Chain() };

  const startNewChainAt = Queue();

  const startNewEmptyChain = () => (currentChain.chain = Chain());

  const startNewChainFromUnresolved = () => (currentChain.chain = Chain(startNewChainAt.dequeue()));

  const getOppositeOrientation = (orientation) =>
    orientation === ORIENTATIONS.VERTICAL ? ORIENTATIONS.HORIZONTAL : ORIENTATIONS.VERTICAL;

  const getAfterTail = () =>
    sumCoordinates(currentChain.chain.peekTail(), currentChain.chain.getAfterTailDirection());

  const getAfterHead = () =>
    sumCoordinates(currentChain.chain.peekHead(), currentChain.chain.getAfterHeadDirection());

  /**
   * Utilizes known unresolved hits to ensure they're resolved.
   * Takes unresolved hits from the current chain and initializes a new chain at each hit with a flipped orientation.
   *
   * @param {Array} unresolvedHits Array of coordinates that represent unresolved hits.
   */
  const handleUnresolvedChain = (unresolvedHits) => {
    if (!unresolvedHits || unresolvedHits.length === 0) return null;
    const oppositeOrientation = getOppositeOrientation(currentChain.chain.getOrientation());
    unresolvedHits.forEach((hit) => {
      hitsManager.addUnresolvedHit(hit);
      startNewChainAt.enqueue({ coordinates: hit, startingOrientation: oppositeOrientation });
    });
    startNewChainFromUnresolved();
  };

  /**
   * Resolves hits within the chain and passes the rest to handleUnresolvedChain.
   *
   * @param {number[]} lastHit Last successful hit in the chain.
   * @param {number} numberOfHitsToResolve
   */
  const resolvePartOfChain = (lastHit, numberOfHitsToResolve) => {
    const unresolvedHits = [];
    if (areCoordinatesEqual(lastHit, currentChain.chain.peekTail())) {
      for (let i = 0; i < numberOfHitsToResolve; i++) {
        hitsManager.resolveHit(currentChain.chain.popTail());
      }
    } else if (areCoordinatesEqual(lastHit, currentChain.chain.peekHead())) {
      for (let i = 0; i < numberOfHitsToResolve; i++) {
        hitsManager.resolveHit(currentChain.chain.popHead());
      }
    } else throw new Error(`lastHit: ${lastHit} is not equal to head or tail end of chain.`);
    while (!currentChain.chain.isEmpty()) unresolvedHits.push(currentChain.chain.popTail());
    handleUnresolvedChain(unresolvedHits);
  };

  /**
   * Resolves the entire current chain.
   */
  const resolveCurrentChain = () => {
    while (!currentChain.chain.isEmpty()) hitsManager.resolveHit(currentChain.chain.popTail());
    if (!startNewChainAt.isEmpty()) startNewChainFromUnresolved();
    else startNewEmptyChain();
  };

  /**
   * Provides coordinates to continue the chain linearly.
   *
   * @returns {number[]|null} Coordinates after head or tail of chain or null if none are valid.
   */
  const tryLinearContinuation = () => {
    const afterTail = getAfterTail();
    if (validateFn(afterTail)) return afterTail;
    const afterHead = getAfterHead();
    if (validateFn(afterHead)) return afterHead;
    return null;
  };

  /**
   * Processes cells around the only coordinate-pair in the chain.
   * Tests the found moves and returns the pair with the highest probability score.
   *
   * @returns {number[]|null} Coordinate pair to attack.
   */
  const tryAroundFirstInChain = () => {
    const openAroundHead = getOpenMovesAround(currentChain.chain.peekHead());
    if (openAroundHead && openAroundHead.length > 0) {
      return getHighestProbabilityFromMoves(openAroundHead);
    } else return null;
  };

  /**
   * Analyzes the current Chain and returns the cell most-likely to result in a successful hit.
   *
   * @returns {number[]} Coordinates to send attack to.
   */
  const getNextInChain = () => {
    if (currentChain.chain.isEmpty()) {
      if (!startNewChainAt.isEmpty()) startNewChainFromUnresolved();
      else return null;
    }
    if (currentChain.chain.size() === 1) {
      if (currentChain.chain.isInitialized()) return tryLinearContinuation();
      const bestAroundHead = tryAroundFirstInChain();
      if (bestAroundHead) return bestAroundHead;
    }
    const nextMove = tryLinearContinuation();
    if (!nextMove) handleUnresolvedChain(currentChain.chain.copyChainToArray());
    return tryLinearContinuation();
  };

  return {
    getNextInChain,
    resolvePartOfChain,
    getChainSize: () => currentChain.chain.size(),
    getChainOrientation: () => currentChain.chain.getOrientation(),
    pushToCurrentChain: (coordinates) => currentChain.chain.addCoordinates(coordinates),
    peekTail: () => currentChain.chain.peekTail(),
    peekHead: () => currentChain.chain.peekHead(),
    getCurrentChainArray: () => currentChain.chain.copyChainToArray(),
    resolveCurrentChain,
    resolveAllChains: () => {
      startNewEmptyChain();
      while (!startNewChainAt.isEmpty()) startNewChainAt.dequeue();
    },
    handleUnresolvedChain
  };
};
