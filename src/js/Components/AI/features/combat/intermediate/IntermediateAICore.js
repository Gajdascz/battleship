import { getOpenMovesAround } from '../../../ai/utilities/gridHelpers';
import { RESULTS } from '../../../Utility/constants';
import { MoveStrategy } from './IntermediateMoveStrategy';
import { popRandom } from '../../../ai/utilities/helperFunctions';

/**
 * Enhances the AI logic to offer a more challenging and nuanced game play experience.
 * Integrates intermediate-level strategies into the AI's decision-making process.
 * @param {object} ai - The AI player object to be enhanced.
 */
export default function addIntermediateLogic({ trackingGrid, getRandomMove, sendAttack }) {
  const moveStrategy = MoveStrategy({
    trackingGrid,
    getOpenMovesAround,
    getRandomMove,
    popRandom
  });

  const makeMove = () => {
    const move = moveStrategy.getNextMove();
    const result = sendAttack(move);
    if (result === RESULTS.SHIP_SUNK) moveStrategy.reset();
    else if (result === RESULTS.HIT) moveStrategy.setLastHit(move);
    return { result, move };
  };

  return {
    getMove: () => moveStrategy.getNextMove(),
    onShipSunk: () => moveStrategy.reset(),
    setLastHit: () => moveStrategy.setLastHit()
  };
}
