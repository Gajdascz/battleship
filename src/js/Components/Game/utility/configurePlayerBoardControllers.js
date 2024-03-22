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

/**
 * Sets up the game display for Ai vs Ai mode.
 */
const setUpAvADisplay = (p1, p2) => {
  const aiOneContainer = buildUIElement(COMMON_ELEMENTS.DIV, {
    attributes: { class: CLASSES.AI_BOARD }
  });
  const aiTwoContainer = buildUIElement(COMMON_ELEMENTS.DIV, {
    attributes: { class: CLASSES.AI_BOARD }
  });
  const display = buildUIElement(COMMON_ELEMENTS.DIV, {
    attributes: { class: CLASSES.AI_VS_AI_DISPLAY }
  });
  aiOneContainer.append(p1.board.provideTrackingGrid(), p2.board.provideTrackingFleet());
  aiTwoContainer.append(p2.board.provideTrackingGrid(), p1.board.provideTrackingFleet());
  display.append(aiOneContainer, aiTwoContainer);
  gameContainer.append(display);
};

/**
 * Configures and initializes board controllers for players based on the game mode.
 *
 * @param {Object} p1 Player 1 object with model and controllers.
 * @param {Object} p2 Player 2 object with model and controllers.
 * @param {string} gameMode The current game mode (HvA, AvA, or HvH).
 * @returns {Object} An object containing the board controllers for player 1 and player 2.
 */
export const configureBoardControllers = (p1, p2, gameMode) => {
  gameContainer.textContent = '';
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
    [GAME_MODES.HvA]: (p1, p2) => {
      if (p1.type === PLAYERS.TYPES.HUMAN)
        p1.board.view.init(p2.board.provideTrackingFleet(), p2.board.provideTrackingGrid());
      else if (p2.type === PLAYERS.TYPES.HUMAN)
        p2.board.view.init(p1.board.provideTrackingFleet(), p1.board.provideTrackingGrid());
    },
    [GAME_MODES.AvA]: setUpAvADisplay,
    [GAME_MODES.HvH]: (p1, p2) => {
      p1.board.view.init(p2.board.provideTrackingFleet());
      p2.board.view.init(p1.board.provideTrackingFleet());
    }
  };
  const p1BoardController = boardController[p1.model.getType()](p1);
  const p2BoardController = boardController[p2.model.getType()](p2);
  initializeBoardView[gameMode](
    { type: p1.model.getType(), board: p1BoardController },
    { type: p2.model.getType(), board: p2BoardController }
  );
  return {
    p1BoardController,
    p2BoardController
  };
};
