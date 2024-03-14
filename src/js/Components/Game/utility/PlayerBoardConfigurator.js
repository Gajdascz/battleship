import { BoardController } from '../../Board/BoardController';
import { GAME_MODES, PLAYERS } from '../../../Utility/constants/common';

const CLASSES = {
  GAME_CONTAINER: 'game-container'
};
const gameContainer = document.querySelector(`.${CLASSES.GAME_CONTAINER}`);

export const configureBoardControllers = (p1, p2, gameMode) => {
  const boardController = {
    [PLAYERS.TYPES.AI]: (player) => player.controllers.board,
    [PLAYERS.TYPES.HUMAN]: (player) =>
      BoardController({
        playerId: player.model.id,
        playerName: player.model.getName(),
        displayContainer: gameContainer,
        gameMode,
        controllers: player.controllers
      })
  };
  const initializeBoardView = {
    [GAME_MODES.HvA]: (human, ai) => {
      human.view.initialize(ai.provideTrackingGrid(), ai.provideTrackingFleet());
    },
    [GAME_MODES.HvH]: (p1, p2) => {
      p1.view.initialize(p2.getPlayerName(), p2.provideTrackingFleet());
      p2.view.initialize(p1.getPlayerName(), p1.provideTrackingFleet());
    }
  };
  const p1BoardController = boardController[p1.model.getType()](p1);
  const p2BoardController = boardController[p2.model.getType()](p2);
  initializeBoardView[gameMode](p1BoardController, p2BoardController);
  return {
    p1BoardController,
    p2BoardController
  };
};
