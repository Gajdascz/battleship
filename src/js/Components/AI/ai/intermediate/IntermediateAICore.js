import { getOpenMovesAround } from '../utilities/gridHelpers';
import { RESULTS } from '../../../Utility/constants';
import { MoveStrategy } from './IntermediateMoveStrategy';
import { popRandom } from '../utilities/helperFunctions';
import addBaseAILogic from '../base/BaseAICore';

/**
 * Enhances the AI logic to offer a more challenging and nuanced game play experience.
 * Integrates intermediate-level strategies into the AI's decision-making process.
 * @param {object} ai - The AI player object to be enhanced.
 */
export default function addIntermediateLogic(ai) {
  if (!ai.hasBaseLogic) addBaseAILogic(ai);
  ai.hasIntermediateLogic = true;
  ai.initializeLogic = () => {
    const moveStrategy = MoveStrategy({
      trackingGrid: ai.board.trackingGrid,
      getOpenMovesAround,
      getRandomMove: ai.getRandomMove,
      popRandom
    });
    ai.makeMove = function makeMove() {
      const move = moveStrategy.getNextMove();
      const result = ai.sendAttack(move);
      if (result === RESULTS.SHIP_SUNK) moveStrategy.reset();
      else if (result === RESULTS.HIT) moveStrategy.setLastHit(move);
      return { result, move };
    };
  };
}
