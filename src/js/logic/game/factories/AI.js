import addIntermediateLogic from '../../ai/intermediate/IntermediateAICore.js';
import addAdvancedLogic from '../../ai/advanced/AdvancedAICore.js';
import addBaseAILogic from '../../ai/base/BaseAICore.js';
import createPlayer from './Player.js';

/**
 * @module AI.js
 * Extends the Player object and provides varying levels of intelligence to an AI
 * to play the game of Battleship.
 *
 * Provides three levels of intelligence:
 *  - 0: No strategy, only makes random moves based on what's open.
 *  - 1: Intermediate strategy, makes moves around previously found hits until a ship has been sunk.
 *  - 2: Advanced strategy, utilizes various structures and algorithms to efficiently find and sink ships.
 *
 */

/**
 * AI initialization factory.
 * Extends the functionality of the Player Object.
 *
 * @param {integer} difficulty Decides which level of intelligence to assign the AI.
 * @param {string} id Used for reliable access to the AI.
 * @returns {object} Contains a wide range of methods for autonomously playing battleship.
 */
export default function createAI(difficulty = 1, id = '') {
  // Initialize base properties.
  const ai = createPlayer();
  ai.type = 'ai';
  ai.id = id;
  ai.difficulty = difficulty;
  ai.isAI = () => true;
  // Apply fundamental AI logic.
  addBaseAILogic(ai);

  switch (difficulty) {
    case 0: {
      ai.name = 'Seaman Bumbling BitBarnacle';
      // Randomly selects and executes a move returning the coordinates and result.
      ai.makeMove = function makeMove() {
        const move = this.getRandomMove();
        const result = this.sendAttack(move);
        return { result, move };
      };
      break;
    }
    case 1: {
      ai.name = 'Captain CodeSmells';
      addIntermediateLogic(ai);
      break;
    }
    case 2: {
      ai.name = 'Fleet Admiral ByteBeard';
      addAdvancedLogic(ai);
      break;
    }
  }

  return ai;
}
