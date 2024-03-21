import { BoardController } from '../../Board/BoardController';
import { GAME_MODES, PLAYERS } from '../../../Utility/constants/common';
import { buildUIElement } from '../../../Utility/uiBuilderUtils/uiBuilders';
import { COMMON_ELEMENTS } from '../../../Utility/constants/dom/elements';
import './ai-vs-ai-styles.css';

const CLASSES = {
  GAME_CONTAINER: 'game-container',
  AI_BOARD: 'ai-board',
  AI_VS_AI_DISPLAY: 'ai-vs-ai-display'
};
const gameContainer = document.querySelector(`.${CLASSES.GAME_CONTAINER}`);

const setUpAvADisplay = (p1, p2) => {
  const existingDisplay = document.querySelector(`.${CLASSES.AI_VS_AI_DISPLAY}`);
  if (existingDisplay) existingDisplay.remove();
  const aiOneContainer = buildUIElement(COMMON_ELEMENTS.DIV, {
    attributes: { class: CLASSES.AI_BOARD }
  });
  const aiTwoContainer = buildUIElement(COMMON_ELEMENTS.DIV, {
    attributes: { class: CLASSES.AI_BOARD }
  });
  const display = buildUIElement(COMMON_ELEMENTS.DIV, {
    attributes: { class: CLASSES.AI_VS_AI_DISPLAY }
  });
  aiOneContainer.append(p1.provideTrackingGrid(), p2.provideTrackingFleet());
  aiTwoContainer.append(p2.provideTrackingGrid(), p1.provideTrackingFleet());
  display.append(aiOneContainer, aiTwoContainer);
  gameContainer.append(display);
};

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
      human.view.init(ai.provideTrackingFleet(), ai.provideTrackingGrid());
    },
    [GAME_MODES.AvA]: setUpAvADisplay,
    [GAME_MODES.HvH]: (p1, p2) => {
      p1.view.init(p2.provideTrackingGrid());
      p2.view.init(p1.provideTrackingFleet());
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
