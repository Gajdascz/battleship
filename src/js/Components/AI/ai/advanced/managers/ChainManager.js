import { ORIENTATIONS } from '../../../../Utility/constants';
import Chain from '../../dataStructures/Chain';
import Queue from '../../dataStructures/Queue';
import { areCoordinatesEqual } from '../../utilities/helperFunctions';

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

  const handleUnresolvedChain = (unresolvedHits) => {
    if (!unresolvedHits || unresolvedHits.length === 0) return null;
    const oppositeOrientation = getOppositeOrientation(currentChain.chain.getOrientation());
    unresolvedHits.forEach((hit) => {
      hitsManager.addUnresolvedHit(hit);
      startNewChainAt.enqueue({ coordinates: hit, orientation: oppositeOrientation });
    });
    startNewChainFromUnresolved();
  };

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
    console.log(hitsManager.getResolvedHits());
    handleUnresolvedChain(unresolvedHits);
  };

  const resolveCurrentChain = () => {
    while (!currentChain.chain.isEmpty()) hitsManager.resolveHit(currentChain.chain.popTail());
    if (!startNewChainAt.isEmpty()) startNewChainFromUnresolved();
    else startNewEmptyChain();
  };

  const tryLinearContinuation = () => {
    const afterTail = getAfterTail();
    if (validateFn(afterTail)) return afterTail;
    const afterHead = getAfterHead();
    if (validateFn(afterHead)) return afterHead;
    return null;
  };

  const tryAroundFirstInChain = () => {
    const openAroundHead = getOpenMovesAround(currentChain.chain.peekHead());
    if (openAroundHead && openAroundHead.length > 0) {
      return getHighestProbabilityFromMoves(openAroundHead);
    } else return null;
  };

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
