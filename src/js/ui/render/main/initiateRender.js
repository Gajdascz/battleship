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
    fleetListSelector: '.main-fleet-list-container',
    trackingListSelector: '.tracking-fleet-list-container'
  });
  buildAndPopulateFleet({
    board: p2Board,
    fleet: p2Fleet,
    fleetListSelector: '.fleet-container > .fleet-ship-list-container',
    trackingListSelector: '.opponent-fleet-container > .fleet-ship-list-container'
  });
};

const createContainer = (appendTo = 'body') => {
  const container = document.createElement('div');
  container.classList.add('board-container');
  document.querySelector(appendTo).append(container);
  return container;
};

const initializeRenderController = (renderController, gameStartedEventDetail) => {
  const { playerOne, playerTwo, boardOptions, currentPlayer } = gameStartedEventDetail;
  let container = document.querySelector('.board-container');
  if (!(container instanceof HTMLElement)) container = createContainer('main');
  [...container.children]?.forEach((child) => child.remove());
};

const initBoardInterface = (renderManager, detail) => {
  const { playerOne, playerTwo, boardOptions, currentPlayer } = detail;
  const container = document.querySelector('.board-container');
  [...container?.children]?.forEach((child) => child.remove());
  renderManager.boardContainer = container;
  renderManager.boardOptions = boardOptions;
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
  console.log(renderManager);
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
    console.log(renderManager);
    console.trace();
    if (renderManager.currentPlayer.type === 'human') renderManager.syncCurrentPlayer();
  }
  if (gameMode === 'HvH') {
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

export default function initializeRender(renderController, gameStartedEvent) {
  initializeRenderController(renderController, gameStartedEvent.detail);
  setRenderStrategy(renderController, gameStartedEvent.detail);
}
