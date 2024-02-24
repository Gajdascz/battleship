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
  const boardDisplay = { current: null };
  const boardViews = new Map();
  const gameContainer = document.querySelector(`.${CLASSES.GAME_CONTAINER}`);
  const currentPlayerDisplay = buildCurrentPlayerDisplay();
  let aiView = null;
  gameContainer.append(currentPlayerDisplay);

  return {
    updateDisplay: (playerID, playerName) => {
      boardDisplay.current?.remove();
      const view = boardViews.get(playerID);
      view.attachTo(gameContainer);
      boardDisplay.current = view;
      currentPlayerDisplay.textContent = playerName;
    },
    setAIView: (view) => (aiView = view),
    attachAIDisplay: () =>
      boardDisplay.current.trackingGrid.attachToWrapper(aiView.getGridElement()),
    addBoardView: (playerID, boardView) => boardViews.set(playerID, boardView),
    getBoardView: (playerID) => boardViews.get(playerID)
  };
};
