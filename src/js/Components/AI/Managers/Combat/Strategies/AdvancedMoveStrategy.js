import { MoveStrategy } from './AdvancedCore/MoveStrategy.js';
import {
  initializeHelpers,
  initializeProcessMoveResult
} from './AdvancedCore/Utils/initializers.js';

/**
 * Provides AI with an advanced attack and result processing strategy.
 * Utilizes two primary methods for strategic game play:
 *  - Probability map for finding most cell that's most likely to result in a hit.
 *  - Chain for tracking consecutive hits to ensure found ships are sunk efficiently.
 *
 * @param {Object} detail External initialization dependencies.
 * @param {number[]} trackingGrid 2D array for tracking attacks and results.
 * @param {function} popRandomMove Function for retrieving random move from availableMoves.
 * @param {Object[]} fleetData Array of objects containing ship data.
 * @returns {Object} Interface for AI to utilize advanced strategy.
 */
export default function AdvancedMoveStrategy({ trackingGrid, popRandomMove, fleetData }) {
  const helpers = initializeHelpers({ trackingGrid, fleetData });
  const { fleetManager, gridHelpers, hitsManager, chainManager, probabilityMap, validateMove } =
    helpers;

  const findBestMove = MoveStrategy(validateMove);

  const processMoveResult = initializeProcessMoveResult({
    hitsManager,
    chainManager,
    copyGrid: gridHelpers.copyGrid,
    updateProbabilityMap: probabilityMap.updateState,
    opponentShipSunk: fleetManager.opponentShipSunk,
    getLastSunkLength: fleetManager.getLastSunkLength,
    areAllOpponentShipsSunk: fleetManager.areAllOpponentShipsSunk
  });

  const getNextMove = () =>
    findBestMove(helpers.chainManager.getNextInChain, probabilityMap, popRandomMove);

  return { getNextMove, processMoveResult };
}
