import { buildUIElement } from '../../Utility/uiBuilderUtils/uiBuilders';
import { COMMON_ELEMENTS } from '../../Utility/constants/dom/elements';

const CLASSES = {
  GAME_CONTAINER: 'game-container'
};

export const GameView = () => {
  const boardDisplay = { current: null };
  const boardViews = new Map();
  const gameContainer = document.querySelector(`.${CLASSES.GAME_CONTAINER}`);
  let aiView = null;

  return {
    updateDisplay: (playerID, playerName) => {
      boardDisplay.current?.remove();
      const view = boardViews.get(playerID);
      view.attachTo(gameContainer);
      boardDisplay.current = view;
    },
    setAIView: (view) => (aiView = view),
    attachAIDisplay: () =>
      boardDisplay.current.trackingGrid.attachToWrapper(aiView.getGridElement()),
    addBoardView: (playerID, boardView) => boardViews.set(playerID, boardView),
    getBoardView: (playerID) => boardViews.get(playerID)
  };
};
