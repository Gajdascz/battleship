import { RESULTS } from '../../../Utility/constants';

export const ProcessMoveResult = ({
  setLastHit,
  addHit,
  pushToChain,
  addUnresolvedHit,
  addSunk,
  getLastSunkLength,
  areHitsEqualToSunk,
  resolveAllUnresolved,
  resolveHit,
  updateProbabilityMap,
  copyGrid,
  opponentShipSunk,
  resolveCurrentChain,
  resolvePartOfChain,
  resolveAllChains,
  getChainSize,
  handleUnresolvedChain
}) =>
  function processMoveResult(move, result) {
    if (result === RESULTS.MISS) updateProbabilityMap(copyGrid(), false);
    else if (result === RESULTS.HIT || result === RESULTS.SHIP_SUNK) {
      setLastHit(move);
      addHit();
      pushToChain(move);
      addUnresolvedHit(move);
      if (result === RESULTS.SHIP_SUNK) {
        const sunkLength = getLastSunkLength();
        const chainSize = getChainSize();
        addSunk(sunkLength);
        opponentShipSunk();
        if (areHitsEqualToSunk()) {
          resolveAllUnresolved();
          resolveAllChains();
        } else if (chainSize === sunkLength) resolveCurrentChain();
        else if (chainSize > sunkLength) resolvePartOfChain(move, sunkLength);
        else handleUnresolvedChain();
        updateProbabilityMap(copyGrid(), true);
      } else updateProbabilityMap(copyGrid(), false);
    }
  };
