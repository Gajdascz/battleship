import { getEndTurnButton, getAlternatePlayerDialog, trackingGridToAIDisplay } from '../../gameStateElements';

const renderStrategyHumanVsAI = (humanBoard, aiBoard, aiName) => {
  const aiTrackingGrid = aiBoard.querySelector('.tracking-grid');
  const aiDisplay = trackingGridToAIDisplay(aiTrackingGrid, aiName);
  humanBoard.querySelector('.tracking-grid-wrapper').append(aiDisplay);
  return null;
};

const renderStrategyHumanVsHuman = (p1Board, p2Board) => {
  const hideScreenDialog = getAlternatePlayerDialog();
  const endTurnBtn = getEndTurnButton();
  endTurnBtn.addEventListener('click', () => document.dispatchEvent(new CustomEvent('turnConcluded')));
  p1Board.querySelector('.main-fleet-list').append(endTurnBtn);
  p2Board.querySelector('.main-fleet-list').append(endTurnBtn);
  document.querySelector('body').append(hideScreenDialog.element);
  return {
    setNextPlayerName: (nextPlayerName) => (hideScreenDialog.playerName = nextPlayerName),
    hideScreen: () => hideScreenDialog.hideScreen()
  };
};

export default function RenderStrategy(gameMode, p1Board, p2Board, p2Name) {
  if (gameMode === 'HvH') return renderStrategyHumanVsHuman(p1Board, p2Board);
  else return renderStrategyHumanVsAI(p1Board, p2Board, p2Name);
}
