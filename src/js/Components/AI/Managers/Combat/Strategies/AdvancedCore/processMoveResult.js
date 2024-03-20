import { STATUSES } from '../../../../../../Utility/constants/common';

export const processMoveResult = ({
  setLastHit,
  addHit,
  pushToCurrentChain,
  addUnresolvedHit,
  addSunk,
  getLastSunkLength,
  areHitsEqualToSunk,
  resolveAllUnresolved,
  updateProbabilityMap,
  copyGrid,
  opponentShipSunk,
  areAllOpponentShipsSunk,
  resolveCurrentChain,
  resolvePartOfChain,
  resolveAllChains,
  getChainSize,
  handleUnresolvedChain
}) =>
  function processMoveResult(resultData) {
    const { coordinates, result } = resultData;
    if (result === STATUSES.MISS) updateProbabilityMap(copyGrid(), false);
    else if (result === STATUSES.HIT || result === STATUSES.SHIP_SUNK) {
      setLastHit(coordinates);
      addHit();
      pushToCurrentChain(coordinates);
      addUnresolvedHit(coordinates);
      if (result === STATUSES.SHIP_SUNK) {
        opponentShipSunk(resultData.id);
        const sunkLength = getLastSunkLength();
        const chainSize = getChainSize();
        addSunk(sunkLength);
        if (areHitsEqualToSunk()) {
          resolveAllUnresolved();
          resolveAllChains();
        } else if (areAllOpponentShipsSunk()) return;
        else if (chainSize === sunkLength) resolveCurrentChain();
        else if (chainSize > sunkLength) resolvePartOfChain(coordinates, sunkLength);
        else handleUnresolvedChain();
        updateProbabilityMap(copyGrid(), true);
      } else updateProbabilityMap(copyGrid(), false);
    }
  };
