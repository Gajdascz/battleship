import buildGameBoard from '../game-board/buildGameBoard';
import buildShip from '../ship/buildShip';
import renderPlacementState from './placement-state/renderPlacementState';

export default function renderModule(boardOptions) {
  const _boardContainerElement = document.querySelector('div.board-container');
  const _currentPlayerElement = document.querySelector('.current-player');
  const _playerOnesBoard = buildGameBoard(boardOptions);
  const _playerTwosBoard = buildGameBoard(boardOptions);

  const getCurrentBoard = () => _boardContainerElement.querySelector('.board');
  const buildShipElements = (shipInfoArray, elementType) => {
    return shipInfoArray.map((shipInfo) => buildShip(shipInfo.health, shipInfo.name, elementType));
  };

  const currentPlayer = (player) => (_currentPlayerElement.textContent = `${player}'s Turn`);
  const populateFleetList = (ships, container) => ships.forEach((ship) => container.append(ship));
  const buildAndPopulateFleet = ({ board, fleet, fleetListSelector, trackingListSelector }) => {
    const fleetListContainer = board.querySelector(fleetListSelector);
    const trackingListContainer = board.querySelector(trackingListSelector);
    const shipElements = buildShipElements(fleet, 'button');
    const shipTrackingElements = buildShipElements(fleet, 'div');
    populateFleetList(shipElements, fleetListContainer);
    populateFleetList(shipTrackingElements, trackingListContainer);
  };
  const initiateFleets = (playerOneFleet, playerTwoFleet) => {
    buildAndPopulateFleet({
      board: _playerOnesBoard,
      fleet: playerOneFleet,
      fleetListSelector: '.fleet-container > .fleet-ship-list-container',
      trackingListSelector: '.opponent-fleet-container'
    });
    buildAndPopulateFleet({
      board: _playerTwosBoard,
      fleet: playerTwoFleet,
      fleetListSelector: '.fleet-container > .fleet-ship-list-container',
      trackingListSelector: '.opponent-fleet-container'
    });
  };

  const placementState = (player) => {
    setCurrentBoard(player);
    const currentBoard = getCurrentBoard();
    const shipListContainer = currentBoard.querySelector('.fleet-container > .fleet-ship-list-container');
    renderPlacementState(currentBoard, shipListContainer);
  };

  const board = (player, state) => {
    if (state === 'placement') placementState(player);
  };
  function setCurrentBoard(player) {
    const currentBoard = _boardContainerElement.querySelector('.board');
    if (currentBoard) currentBoard.remove();
    _boardContainerElement.append(player.id === 'playerOne' ? _playerOnesBoard : _playerTwosBoard);
  }

  const updateCell = (player, coordinates, result) => {
    const board = player === 'playerOne' ? _playerOnesBoard : _playerTwosBoard;
    const trackingCell = board.querySelector(`[data-coordinates]=${coordinates[0]}${coordinates[1]}`);
    trackingCell.classList.add(result);
    if (result === 'hit') {
      const opponentsBoard = player === 'playerOne' ? _playerTwosBoard : _playerOnesBoard;
      const mainCell = opponentsBoard.querySelector(`button[value=${coordinates[0]}${coordinates[1]}`);
      mainCell.classList.add('own-ship-hit');
    }
  };

  return { initiateFleets, currentPlayer, board, updateCell };
}
