import { buildUIElement } from '../../Utility/uiBuilderUtils/uiBuilders';
import { COMMON_ELEMENTS } from '../../Utility/constants/dom/elements';

const CLASSES = {
  GAME_CONTAINER: 'game-container'
};

export const GameView = () => {
  const boardViews = { current: null, waiting: null };
  const gameContainer = document.querySelector(`.${CLASSES.GAME_CONTAINER}`);

  return {
    displayCurrent: () => boardViews.current.attachTo(gameContainer),
    switch: () => {
      const tmp = boardViews.current;
      boardViews.waiting = boardViews.current;
      boardViews.current = tmp;
    },
    setBoardViews: (current, waiting) => {
      boardViews.current = current;
      boardViews.waiting = waiting;
      boardDisplay.current = current;
    },
    getBoardViews: () => boardViews
  };
};
