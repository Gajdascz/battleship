import { buildUIElement } from '../../utility/uiBuilderUtils/uiBuilders';
import { COMMON_ELEMENTS } from '../../utility/constants/dom/elements';

const CLASSES = {
  GAME_CONTAINER: 'game-container',
  CURRENT_PLAYER_DISPLAY: 'current-player-display'
};

const buildCurrentPlayerDisplay = () =>
  buildUIElement(COMMON_ELEMENTS.DIV, {
    attributes: { class: CLASSES.CURRENT_PLAYER_DISPLAY }
  });

export const GameView = () => {
  const gameContainer = document.querySelector(`.${CLASSES.GAME_CONTAINER}`);
  const currentPlayerDisplay = buildCurrentPlayerDisplay();
  gameContainer.append(currentPlayerDisplay);

  return {
    updateBoard: (board) => {
      gameContainer.textContent = '';
      gameContainer.append(board);
    },
    updateCurrentPlayerDisplay: (playerName) => (currentPlayerDisplay.textContent = playerName)
  };
};
