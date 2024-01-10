import { getAlternatePlayerDialog, getEndTurnButton, trackingGridToAIDisplay } from '../renderElements';
import buildGameBoard from '../../game-board/buildGameBoard';
import buildShip from '../../ship/buildShip';

const buildAndPopulateFleet = ({ board, fleet, fleetListSelector, trackingListSelector }) => {
  const buildShipElements = (shipInfo, element) => shipInfo.map((info) => buildShip(info.health, info.name, element));
  const populateFleetList = (ships, container) => ships.forEach((ship) => container.append(ship));
  const fleetListContainer = board.querySelector(fleetListSelector);
  const trackingListContainer = board.querySelector(trackingListSelector);
  const shipElements = buildShipElements(fleet, 'button');
  const shipTrackingElements = buildShipElements(fleet, 'div');
  populateFleetList(shipElements, fleetListContainer);
  populateFleetList(shipTrackingElements, trackingListContainer);
};
const initiateFleets = ({ p1Board, p1Fleet }, { p2Board, p2Fleet }) => {
  buildAndPopulateFleet({
    board: p1Board,
    fleet: p1Fleet,
    fleetListSelector: '.fleet-container > .fleet-ship-list-container',
    trackingListSelector: '.opponent-fleet-container > .fleet-ship-list-container'
  });
  buildAndPopulateFleet({
    board: p2Board,
    fleet: p2Fleet,
    fleetListSelector: '.fleet-container > .fleet-ship-list-container',
    trackingListSelector: '.opponent-fleet-container > .fleet-ship-list-container'
  });
};

const initBoardInterface = (renderManager, detail) => {
  const { playerOne, playerTwo, boardOptions, currentPlayer } = detail;
  const container = document.querySelector('.board-container');
  renderManager.boardContainer = container;
  renderManager.currentPlayerDisplay = document.querySelector('.current-player');
  renderManager.p1Board = buildGameBoard(boardOptions);
  renderManager.p2Board = buildGameBoard(boardOptions);
  renderManager.p1Board.classList.add('p1Board');
  renderManager.p2Board.classList.add('p2Board');
  renderManager.currentPlayer = currentPlayer;
  initiateFleets(
    { p1Fleet: playerOne.fleet, p1Board: renderManager.p1Board },
    { p2Fleet: playerTwo.fleet, p2Board: renderManager.p2Board }
  );
};

const setRenderStrategy = (renderManager, detail) => {
  const { gameMode, playerOne, playerTwo } = detail;
  function strategyHumanVsHuman() {
    renderManager.currentPlayerFleetList.append(renderManager.endTurnBtn);
    renderManager.endTurnBtn.onclick = () => {
      renderManager.hideScreen();
      renderManager.syncCurrentPlayer();
      renderManager.endTurnBtn.onclick = null;
      renderManager.endTurnBtn.remove();
    };
  }
  function strategyHumanVsAI() {
    if (renderManager.currentPlayer.type === 'human') renderManager.syncCurrentPlayer();
  }
  function strategyAIvAI() {}

  if (gameMode === 'AvA') {
    renderManager.renderManager = strategyAIvAI;
    const ai1TrackingGrid = renderManager.p1Board.querySelector('.tracking-grid');
    trackingGridToAIDisplay(ai1TrackingGrid, playerOne.name);
    const ai2TrackingGrid = renderManager.p2Board.querySelector('.tracking-grid');
    trackingGridToAIDisplay(ai2TrackingGrid, playerTwo.name);
    renderManager.p1Board.querySelector('.main-grid').classList.add('hide');
    renderManager.p2Board.querySelector('.main-grid').classList.add('hide');
  } else if (gameMode === 'HvH') {
    renderManager.renderStrategy = strategyHumanVsHuman;
    renderManager.hideScreenDialog = getAlternatePlayerDialog();
    renderManager.endTurnBtn = getEndTurnButton();
    document.querySelector('body').append(renderManager.hideScreenDialog.element);
    renderManager.hideScreen = () => {
      renderManager.hideScreenDialog.playerName = renderManager.currentPlayer.name;
      renderManager.hideScreenDialog.element.showModal();
    };
  } else {
    renderManager.renderStrategy = strategyHumanVsAI;
    if (playerOne.type === 'human') {
      const aiTrackingGrid = renderManager.p2Board.querySelector('.tracking-grid');
      const aiMoveDisplay = trackingGridToAIDisplay(aiTrackingGrid, playerTwo.name);
      renderManager.p1Board.querySelector('.tracking-grid-wrapper').append(aiMoveDisplay);
      renderManager.p1Board.querySelector('.tracking-grid').classList.add('player-tracking-grid');
    } else {
      const aiTrackingGrid = renderManager.p1Board.querySelector('.tracking-grid');
      const aiMoveDisplay = trackingGridToAIDisplay(aiTrackingGrid, playerOne.name);
      renderManager.p2Board.querySelector('.tracking-grid-wrapper').append(aiMoveDisplay);
      renderManager.p2Board.querySelector('.tracking-grid').classList.add('player-tracking-grid');
    }
  }
};

export default function initiateRender(e, renderManager) {
  initBoardInterface(renderManager, e.detail);
  setRenderStrategy(renderManager, e.detail);
}
