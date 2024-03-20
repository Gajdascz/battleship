import {
  getCellInADirection,
  getCellsInAllDirections,
  getCellStatusAt,
  getOpenMovesAround,
  getTypeOfCellInADirection,
  copyGrid,
  isAtEdge
} from '../../../../../../../Utility/utils/gridUtils.js';
import {
  sumCoordinates,
  getPerpendicularCoordinates,
  getOrientationDirections
} from '../../../../../../../Utility/utils/coordinatesUtils.js';

import { STATUSES } from '../../../../../../../Utility/constants/common.js';
import { canShipFit as checkCanShipFit } from './canShipFit.js';
import { HitsManager } from '../Managers/HitsManager.js';
import { OpponentFleetManager } from '../Managers/OpponentFleetManager.js';
import { ChainManager } from '../Managers/ChainManager.js';

import { ProbabilityMap } from './Probability/ProbabilityMap';

import { processMoveResult } from '../processMoveResult';

const initializeGridHelpers = (trackingGrid) => {
  const inGrid =
    (fn) =>
    (...args) =>
      fn(trackingGrid, ...args);

  const inGridOfType =
    (fn, type) =>
    (...args) =>
      fn({ grid: trackingGrid, ...args, type });
  return {
    getCellStatusAt: inGrid(getCellStatusAt),
    getCellInADirection: inGrid(getCellInADirection),
    getOpenMovesAround: inGrid(getOpenMovesAround),
    getCellsInAllDirections: inGrid(getCellsInAllDirections),
    getOpenMovesInADirection: inGridOfType(getTypeOfCellInADirection, STATUSES.UNEXPLORED),
    getConsecutiveHitsInADirection: inGridOfType(getTypeOfCellInADirection, STATUSES.HIT),
    copyGrid: inGrid(copyGrid),
    isAtEdge: inGrid(isAtEdge)
  };
};

export const initializeHelpers = ({ trackingGrid, fleetData }) => {
  const fleetManager = OpponentFleetManager(fleetData);
  const hitsManager = HitsManager();
  const gridHelpers = initializeGridHelpers(trackingGrid, hitsManager.isHitResolved);
  const validateMove = (move) =>
    move && gridHelpers.getCellStatusAt(move) === STATUSES.UNEXPLORED && canShipFit(move);

  const canShipFit = (move) =>
    checkCanShipFit({
      getCellStatusAt: gridHelpers.getCellStatusAt,
      getCellInADirection: gridHelpers.getCellInADirection,
      getOrientationDirections,
      isHitResolved: hitsManager.isHitResolved,
      start: move,
      smallestShipLength: fleetManager.getSmallestAliveOpponentShipLength()
    });

  const probabilityMap = ProbabilityMap({
    initialGrid: trackingGrid,
    canShipFit,
    gridHelpers,
    getOrientationDirections,
    isHitResolved: hitsManager.isHitResolved,
    getLiveOpponentShipLengths: fleetManager.getLiveOpponentShipLengths,
    getSmallestShipLength: fleetManager.getSmallestAliveOpponentShipLength,
    validateFn: validateMove
  });
  const chainManager = ChainManager({
    validateFn: validateMove,
    sumCoordinates,
    getPerpendicularCoordinates,
    getOpenMovesAround: gridHelpers.getOpenMovesAround,
    getHighestProbabilityFromMoves: probabilityMap.getHighestProbabilityFromMoves,
    getHitWithHighestSurroundingProbability: probabilityMap.getHitWithHighestSurroundingProbability,
    hitsManager
  });

  return {
    fleetManager,
    gridHelpers,
    hitsManager,
    chainManager,
    probabilityMap,
    validateMove
  };
};
export const initializeProcessMoveResult = (initData) => {
  const {
    hitsManager,
    chainManager,
    copyGrid,
    updateProbabilityMap,
    opponentShipSunk,
    getLastSunkLength,
    areAllOpponentShipsSunk
  } = initData;
  const {
    setLastHit,
    addHit,
    addUnresolvedHit,
    addSunk,
    areHitsEqualToSunk,
    resolveAllUnresolved,
    resolveHit
  } = hitsManager;
  const {
    resolvePartOfChain,
    getChainSize,
    pushToCurrentChain,
    resolveCurrentChain,
    resolveAllChains,
    handleUnresolvedChain
  } = chainManager;
  return processMoveResult({
    setLastHit,
    addHit,
    pushToCurrentChain,
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
    handleUnresolvedChain,
    areAllOpponentShipsSunk
  });
};
