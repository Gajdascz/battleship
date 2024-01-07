import { gameInitializers } from './initializer';

export default function gameController({
  playerOneInformation = { type: 'human', name: '', difficulty: '' },
  playerTwoInformation = { type: 'ai', name: '', difficulty: 0 },
  boardOptions = { rows: 10, cols: 10, letterAxis: 'row' },
  fleetType = 'default'
} = {}) {
  const initializer = gameInitializers();
  playerOneInformation.id = 'playerOne';
  playerTwoInformation.id = 'playerTwo';
  const _playerOne = initializer.player(playerOneInformation);
  const _playerTwo = initializer.player(playerTwoInformation);
  const _boardOptions = initializer.playerBoards(_playerOne, _playerTwo, boardOptions);
  const _fleet = initializer.playerFleets(_playerOne, _playerTwo, fleetType);
  const _gameMode = initializer.gameMode(playerOneInformation.type, playerTwoInformation.type);
  let _currentPlayer = _playerOne;
  let _waitingPlayer = _playerTwo;
  const switchCurrentPlayer = () => {
    if (_currentPlayer === _playerOne) {
      _currentPlayer = _playerTwo;
      _waitingPlayer = _playerOne;
    } else {
      _currentPlayer = _playerOne;
      _waitingPlayer = _playerTwo;
    }
  };

  const isPlacementState = () => {
    return (
      !(_playerOne.board.placedShips === _playerOne.fleet.length) &&
      !(_playerTwo.board.placedShips === _playerTwo.fleet.length)
    );
  };
  const isInProgressState = () => {
    return !this.isPlacementState && !this.isGameOverState;
  };

  const isGameOverState = () => {
    return _playerOne.board.allShipsSunk || _playerTwo.board.allShipsSunk;
  };

  const placeShip = (player, coordinates) => {};

  return {
    get playerOne() {
      return _playerOne;
    },
    get playerTwo() {
      return _playerTwo;
    },
    get boardOptions() {
      return _boardOptions;
    },
    get gameFleet() {
      return _fleet;
    },
    get currentPlayer() {
      return _currentPlayer;
    },
    get waitingPlayer() {
      return _waitingPlayer;
    },
    get gameMode() {
      return _gameMode;
    },
    get state() {
      if (isPlacementState()) return 'placement';
      else if (isInProgressState()) return 'inProgress';
      else if (isGameOverState()) return 'gameOver';
      else return 'Error';
    },
    switchCurrentPlayer
  };
}
