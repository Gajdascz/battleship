import addIntermediateLogic from './intermediateAILogic';
import addAdvancedLogic from './advancedAILogic';
import initBaseAILogic from './baseAILogic';
import createPlayer from '../factories/player';

const initDifficultyZero = (ai) => {
  ai.name = 'Seaman Bumbling BitBarnacle';
  ai.makeMove = function makeMove() {
    const move = this.getRandomMove();
    const result = this.sendAttack(move);
    return { result, move };
  };
  return ai;
};

const initDifficultyOne = (ai) => {
  ai.name = 'Captain CodeSmells';
  addIntermediateLogic(ai);
  return ai;
};

const initDifficultyTwo = (ai) => {
  ai.name = 'Fleet Admiral ByteBeard';
  addIntermediateLogic(ai);
  addAdvancedLogic(ai);
  return ai;
};

export default function computerAI(difficulty = 1, id = '') {
  const ai = createPlayer();
  ai.type = 'ai';
  ai.id = id;
  ai.difficulty = difficulty;
  Object.defineProperty(ai, 'isAI', {
    get: function () {
      return true;
    }
  });
  initBaseAILogic(ai);
  if (difficulty === 0) return initDifficultyZero(ai);
  else if (difficulty === 1) return initDifficultyOne(ai);
  else if (difficulty === 2) return initDifficultyTwo(ai);
}
