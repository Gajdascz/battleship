import {
  getEndTurnButton,
  getAlternatePlayerDialog,
  trackingGridToAIDisplay
} from '../gameState/gameStateElements';

const renderStrategyHumanVsAI = (humanBoard, aiBoard, aiName, elementManager) => {
  const aiTrackingGrid = aiBoard.querySelector('.tracking-grid');
  const aiDisplay = trackingGridToAIDisplay(aiTrackingGrid, aiName);
  humanBoard.querySelector('.tracking-grid-wrapper').append(aiDisplay);
  elementManager.cacheElement('aidDisplay', aiDisplay);
  return null;
};

const renderStrategyHumanVsHuman = (elementManager) => {
  const hideScreenDialog = getAlternatePlayerDialog();
  const endTurnBtn = getEndTurnButton();
  const onTurnConcluded = (e) => {
    document.dispatchEvent(new CustomEvent('turnConcluded'));
    endTurnBtn.remove();
  };
  endTurnBtn.addEventListener('click', onTurnConcluded);
  document.querySelector('body').append(hideScreenDialog.element);
  elementManager.cacheElement('hideScreenDialog', hideScreenDialog.element);
  elementManager.cacheElement('endTurnBtn', endTurnBtn);
  return {
    setNextPlayerName: (nextPlayerName) => (hideScreenDialog.playerName = nextPlayerName),
    hideScreen: () => hideScreenDialog.hideScreen(),
    endTurnBtn,
    enableEndTurnBtn: (fleetList) => {
      fleetList.append(endTurnBtn);
      endTurnBtn.classList.remove('hide');
      endTurnBtn.removeAttribute('disabled');
    },
    disableEndTurnBtn: (fleetList) => {
      fleetList.append(endTurnBtn);
      endTurnBtn.classList.add('hide');
      endTurnBtn.setAttribute('disabled', true);
    },
    reset: () => endTurnBtn.removeEventListener('click', onTurnConcluded)
  };
};

export default function RenderStrategy(gameMode, p1Board, p2Board, p2Name, elementManager) {
  if (gameMode === 'HvH') return renderStrategyHumanVsHuman(elementManager);
  else return renderStrategyHumanVsAI(p1Board, p2Board, p2Name, elementManager);
}
