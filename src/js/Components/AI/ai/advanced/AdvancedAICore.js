import {
  getCellInADirection,
  getCellsInAllDirections,
  getValueAt,
  getOpenMovesAround,
  getOpenMovesInADirection,
  getHitsAround,
  getConsecutiveHitsInADirection,
  copyGrid,
  isAtEdge
} from '../utilities/gridHelpers.js';
import {
  sumCoordinates,
  getPerpendicularCoordinates,
  getDelta,
  getOrientationDirections
} from '../utilities/coordinatesHelpers.js';

import { removeDuplicates } from '../utilities/helperFunctions.js';

import { RESULTS } from '../../../Utility/constants.js';
import { canShipFit as checkCanShipFit } from './utilities/canShipFit.js';
import { MovesManager } from './managers/MovesManager.js';
import { HitsManager } from './managers/HitsManager.js';

import { AdvancedGridHelpers } from './utilities/AdvancedGridHelpers.js';
import { FleetManager } from './managers/FleetManager.js';
import { MoveStrategy } from './strategies/MoveStrategy.js';
import { ChainManager } from './managers/ChainManager.js';

import { ProcessMoveResult } from './processMoveResults';

import { ProbabilityMap } from './strategies/ProbabilityMap.js';

const initializeGridHelpers = (trackingGrid, isHitResolved) =>
  AdvancedGridHelpers({
    trackingGrid,
    getCellInADirection,
    getValueAt,
    getCellsInAllDirections,
    getOpenMovesAround,
    getOpenMovesInADirection,
    getHitsAround,
    getConsecutiveHitsInADirection,
    isHitResolved,
    removeDuplicates,
    copyGrid,
    isAtEdge
  });

const initializeMoveStrategy = (helpers, ai) =>
  MoveStrategy({
    MovesManager,
    getDelta,
    sumCoordinates,
    gridHelpers: helpers.gridHelpers,

    getHitsAround: helpers.gridHelpers.getHitsAround,
    getOpenMovesAround: helpers.gridHelpers.getOpenMovesAround,
    getTotalConsecutiveUnresolvedHitsInADirection:
      helpers.gridHelpers.getTotalConsecutiveUnresolvedHitsInADirection,
    getUniqueOpenMovesAroundHits: helpers.gridHelpers.getUniqueOpenMovesAroundHits,

    validateFn: helpers.validateMove,

    totalShipLength: helpers.fleetManager.getTotalFleetLength,
    getNumberOfOpponentShipsLeft: helpers.fleetManager.getNumberOfOpponentShipsLeft,

    isHitResolved: helpers.hitsManager.isHitResolved,
    getSunk: helpers.hitsManager.getSunk,
    getLastHit: helpers.hitsManager.getLastHit,
    getUnresolvedHits: helpers.hitsManager.getUnresolvedHits,

    totalAvailableMoves: ai.getTotalAvailableMoves,
    getCurrentTotalAvailableMoves: ai.getTotalAvailableMoves,
    getRandomMove: ai.getRandomMove,
    getAvailableMoves: ai.getAvailableMoves
  });

export default function addAdvancedLogic(ai) {
  if (!ai || !ai.isAI()) throw new Error('Invalid AI object provided to wrapHelpers.');
  ai.initializeLogic = () => {
    const fleetManager = FleetManager(ai.fleet, ai.getLastOpponentShipSunk);
    const hitsManager = HitsManager();
    const gridHelpers = initializeGridHelpers(ai.board.trackingGrid, hitsManager.isHitResolved);
    const validateMove = (move) =>
      move && gridHelpers.getValueAt(move) === RESULTS.UNEXPLORED && canShipFit(move);

    const canShipFit = (move) =>
      checkCanShipFit({
        getValueAt: gridHelpers.getValueAt,
        getCellInADirection: gridHelpers.getCellInADirection,
        getOrientationDirections,
        isHitResolved: hitsManager.isHitResolved,
        start: move,
        getSmallestShipLength: fleetManager.getSmallestAliveOpponentShipLength
      });

    const probabilityMap = ProbabilityMap({
      initialGrid: ai.board.trackingGrid,
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
      getHitWithHighestSurroundingProbability:
        probabilityMap.getHitWithHighestSurroundingProbability,
      hitsManager
    });

    const helpers = {
      fleetManager,
      gridHelpers,
      hitsManager,
      chainManager,
      validateMove
    };

    const moveStrategy = initializeMoveStrategy(helpers, ai);

    const processMoveResult = ProcessMoveResult({
      setLastHit: helpers.hitsManager.setLastHit,
      addHit: helpers.hitsManager.addHit,
      addUnresolvedHit: helpers.hitsManager.addUnresolvedHit,
      addSunk: helpers.hitsManager.addSunk,
      areHitsEqualToSunk: helpers.hitsManager.areHitsEqualToSunk,
      resolveAllUnresolved: helpers.hitsManager.resolveAllUnresolved,
      resolveHit: helpers.hitsManager.resolveHit,

      pushToChain: helpers.chainManager.pushToCurrentChain,
      getChainSize: helpers.chainManager.getChainSize,
      resolvePartOfChain: helpers.chainManager.resolvePartOfChain,
      resolveCurrentChain: helpers.chainManager.resolveCurrentChain,
      resolveAllChains: helpers.chainManager.resolveCurrentChain,
      handleUnresolvedChain: helpers.chainManager.handleUnresolvedChain,

      opponentShipSunk: helpers.fleetManager.opponentShipSunk,
      getLastSunkLength: helpers.fleetManager.getLastSunkLength,
      updateProbabilityMap: probabilityMap.updateState,

      copyGrid: gridHelpers.copyGrid
    });

    ai.makeMove = function makeMove() {
      const move = moveStrategy.findBestMove(
        helpers.chainManager.getNextInChain,
        probabilityMap,
        ai.getRandomMove
      );
      const result = ai.sendAttack(move);
      console.log(`makeMove: ${move} | ${result}`);
      processMoveResult(move, result);
      return { result, move };
    };
  };
}
