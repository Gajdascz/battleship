const CLASSES = {
  GAME_CONTAINER: 'game-container'
};

export const GameView = () => {
  const boardDisplay = { current: null };
  const boardViews = new Map();
  const gameContainer = document.querySelector(`.${CLASSES.GAME_CONTAINER}`);

  return {
    updateDisplay: (playerID) => {
      boardDisplay.current?.remove();
      const view = boardViews.get(playerID);
      view.attachTo(gameContainer);
      boardDisplay.current = view;
    },
    setBoardView: (current, waiting) => {
      boardDisplay.current = current;
      boardDisplay.waiting = waiting;
    },
    addBoardView: (playerID, boardView) => boardViews.set(playerID, boardView),
    getBoardView: (playerID) => boardViews.get(playerID)
  };
};
