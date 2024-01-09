import { getAlternatePlayerDialog, trackingGridToAIDisplay } from './renderElements';
import buildGameBoard from '../game-board/buildGameBoard';
import buildShip from '../ship/buildShip';
import renderPlacementState from './placement-state/renderPlacementState';
import renderInProgressState from './progress-state/renderInProgressState';

//import renderManager from './renderManager';

const buildShipElements = (shipInfoArray, elementType) => {
  return shipInfoArray.map((shipInfo) => buildShip(shipInfo.health, shipInfo.name, elementType));
};
const populateFleetList = (ships, container) => ships.forEach((ship) => container.append(ship));
const buildAndPopulateFleet = ({ board, fleet, fleetListSelector, trackingListSelector }) => {
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

function renderStateManager() {
  let _boardContainer = null;
  let _currentBoard = null;
  let _currentPlayerDisplay = null;
  let _p1Board = null;
  let _p2Board = null;
  let _currentStateComponents = null;
  let _gameMode = null;
  let _currentPlayer = null;
  return {
    get boardContainer() {
      return _boardContainer;
    },
    set boardContainer(newContainer) {
      _boardContainer = newContainer;
    },
    get currentBoard() {
      return _boardContainer.querySelector('.board');
    },
    set currentBoard(newBoard) {
      if (this.currentBoard) this.currentBoard.remove();
      _currentBoard = newBoard;
      _boardContainer.append(_currentBoard);
    },
    get currentPlayerDisplay() {
      return _currentPlayerDisplay;
    },
    set currentPlayerDisplay(newDisplay) {
      _currentPlayerDisplay = newDisplay;
    },
    get p1Board() {
      return _p1Board;
    },
    set p1Board(board) {
      _p1Board = board;
    },
    get p2Board() {
      return _p2Board;
    },
    set p2Board(board) {
      _p2Board = board;
    },
    get currentPlayer() {
      return _currentPlayer;
    },
    set currentPlayer(player) {
      _currentPlayer = player;
      _currentPlayerDisplay.textContent = `${_currentPlayer.name}'s Turn`;
    },
    get currentPlayerBoard() {
      return _currentPlayer.id === 'playerOne' ? _p1Board : _p2Board;
    },
    get currentPlayerMainGrid() {
      return this.currentPlayerBoard.querySelector(`.main-grid`);
    },
    get currentPlayerFleetList() {
      return _currentBoard.querySelector('.fleet-container > .fleet-ship-list-container');
    },
    get currentPlayerTrackingGrid() {
      return _currentBoard.querySelector('.tracking-grid');
    },
    get currentPlayerTrackingFleetList() {
      return _currentBoard.querySelector('.opponent-fleet-container > .fleet-ship-list-container');
    },
    get opponentPlayerBoard() {
      return _currentPlayer.id === 'playerOne' ? _p2Board : _p1Board;
    },
    get opponentPlayerMainGrid() {
      return this.opponentPlayerBoard.querySelector('.main-grid');
    },
    get gameMode() {
      return _gameMode;
    },
    set gameMode(mode) {
      _gameMode = mode;
    },
    get currentStateComponents() {
      return _currentStateComponents;
    },
    clearStateComponents: function () {
      _currentStateComponents?.clearState();
      _currentStateComponents = null;
    },
    placementState: function (callback) {
      if (_currentStateComponents !== null) this.clearStateComponents();
      _currentStateComponents = renderPlacementState(_currentBoard, this.currentPlayerFleetList, callback);
    },
    inProgressState: function (callback) {
      if (_currentStateComponents !== null) this.clearStateComponents();
      _currentStateComponents = renderInProgressState(_p1Board, _p2Board, callback);
    }
  };
}

export default (() => {
  const renderManager = renderStateManager();

  function strategyHumanVsHuman(currentPlayer) {
    renderManager.hideScreenDialog.playerName = currentPlayer.name;
    renderManager.hideScreen();
    renderManager.currentPlayer = currentPlayer;
    renderManager.currentBoard = renderManager.currentPlayerBoard;
  }
  function strategyHumanVsAI(currentPlayer) {
    renderManager.currentPlayer = currentPlayer;
    if (currentPlayer.type === 'human') renderManager.currentBoard = renderManager.currentPlayerBoard;
  }
  function runAIvAI() {}

  function initGame(e) {
    const { boardOptions, gameMode, playerOne, playerTwo } = e.detail;
    const container = document.querySelector('.board-container');
    const dummyBoard = document.createElement('div');
    container.append(dummyBoard);
    renderManager.boardContainer = container;
    dummyBoard.classList.add('board');
    renderManager.boardContainer.append(dummyBoard);
    renderManager.currentPlayerDisplay = document.querySelector('.current-player');
    renderManager.p1Board = buildGameBoard(boardOptions);
    renderManager.p2Board = buildGameBoard(boardOptions);
    initiateFleets(
      { p1Fleet: playerOne.fleet, p1Board: renderManager.p1Board },
      { p2Fleet: playerTwo.fleet, p2Board: renderManager.p2Board }
    );
    if (gameMode === 'AvA') runAIvAI();
    else {
      renderManager.gameMode = gameMode;
      if (renderManager.gameMode === 'HvH') {
        renderManager.renderStrategy = strategyHumanVsHuman;
        renderManager.hideScreenDialog = getAlternatePlayerDialog();
        document.querySelector('body').append(renderManager.hideScreenDialog.element);
        renderManager.hideScreen = () => renderManager.hideScreenDialog.element.showModal();
      } else {
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
        renderManager.renderStrategy = strategyHumanVsAI;
      }
    }

    document.addEventListener('gamePlacementState', placementState);
  }

  function placementState(e) {
    document.removeEventListener('gameStarted', initGame);
    const { callback, currentPlayer } = e.detail;
    if (renderManager.gameMode === 'HvH') {
      console.log(renderManager.hideScreenDialog);
      renderManager.hideScreenDialog.playerName = currentPlayer.name;
      renderManager.hideScreenDialog.hideScreen();
    }
    renderManager.currentPlayer = currentPlayer;
    renderManager.currentBoard = renderManager.currentPlayerBoard;
    renderManager.placementState(callback);
    document.addEventListener('placementsProcessed', renderManager.clearStateComponents);
    document.addEventListener('gameInProgressState', inProgressState);
  }

  function inProgressState(e) {
    document.removeEventListener('gamePlacementState', placementState);
    const { callback, currentPlayer } = e.detail;
    renderManager.currentPlayer = currentPlayer;
    renderManager.inProgressState(callback);
    renderManager.renderStrategy(renderManager.currentPlayer);
    document.addEventListener('gameOverState', gameOverState);
  }

  function gameOverState(e) {}

  document.addEventListener('gameStarted', initGame);
})();
