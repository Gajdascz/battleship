import { gameInitializers } from './initializer';

export default function gameController({
  playerOneInformation = { type: 'human', name: '' },
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
  const _gameMode = initializer.gameMode(playerTwoInformation.type);
  let _currentPlayer = _playerOne;
  let _waitingPlayer = _playerTwo;
  if (_playerTwo.type === 'ai') initializer.ai(_playerTwo);
  const switchCurrentPlayer = () => {
    if (_currentPlayer === _playerOne) {
      _currentPlayer = _playerTwo;
      _waitingPlayer = _playerOne;
    } else {
      _currentPlayer = _playerOne;
      _waitingPlayer = _playerTwo;
    }
    document.dispatchEvent(new CustomEvent('playerSwitched'));
  };
  const isControllerInitialized = () => {
    if (
      !(
        _playerOne.isPlayer &&
        _playerOne.id === 'playerOne' &&
        _playerOne.board.isBoard &&
        _playerOne.fleet.length === _fleet.length &&
        _playerTwo.isPlayer &&
        _playerTwo.id === 'playerTwo' &&
        _playerTwo.board.isBoard &&
        _playerTwo.fleet.length === _fleet.length &&
        _currentPlayer.isPlayer &&
        _waitingPlayer.isPlayer &&
        _currentPlayer.id !== _waitingPlayer.id
      )
    ) {
      return false;
    }
    return true;
  };

  const isShipsPlaced = (player) => player.board.placedShips === player.fleet.length;
  const isPlacementState = () => !isShipsPlaced(_playerOne) || !isShipsPlaced(_playerTwo);

  const isInProgressState = () => !isPlacementState() && !isGameOverState();

  const isGameOverState = () => _playerOne.board.allShipsSunk || _playerTwo.board.allShipsSunk;

  const startGame = () => {
    document.dispatchEvent(
      new CustomEvent('gameStarted', {
        detail: {
          gameMode: _gameMode,
          boardOptions: _boardOptions,
          playerOne: _playerOne,
          playerTwo: _playerTwo,
          currentPlayer: _currentPlayer,
          waitingPlayer: _waitingPlayer
        }
      })
    );
    placementState();
  };

  const placementState = () => {
    if (_currentPlayer.type === 'ai' && !isShipsPlaced(_currentPlayer)) {
      _currentPlayer.placeShips();
      switchCurrentPlayer();
      placementState();
    }
    if (isInProgressState()) inProgressState();
    else {
      document.dispatchEvent(
        new CustomEvent('gamePlacementState', {
          detail: {
            onPlacementSubmission
          }
        })
      );
    }
  };
  const onPlacementSubmission = (placementDetails) => {
    const placementMap = placementDetails.detail.placements;
    _currentPlayer.fleet.forEach((ship) => {
      const { start, end } = placementMap.get(ship.id);
      if (!_currentPlayer.board.place({ ship, start, end }))
        throw new Error(`${_currentPlayer.id}'s ${ship.id} Placement Failed.`);
    });
    switchCurrentPlayer();
    document.dispatchEvent(new CustomEvent('placementsProcessed'));
    if (isPlacementState()) placementState();
    else inProgressState();
  };

  const onPlayerAttack = (attack, isAI = false) => {
    let attackResult;
    let gameOver = false;
    const event = { detail: {} };
    if (isAI) {
      attackResult = attack.result;
      event.detail.coordinates = attack.move;
    } else {
      const { coordinates } = attack.detail;
      attackResult = _currentPlayer.board.outgoingAttack(coordinates, _waitingPlayer.board);
      event.detail.coordinates = coordinates;
    }
    if (attackResult === 1) {
      event.detail.result = 'lastShipSunk';
      event.detail.sunkShipName = _waitingPlayer.board.lastShipSunk;
      gameOver = true;
    } else if (attackResult === false) event.detail.result = 'miss';
    else if (attackResult === true) event.detail.result = 'hit';
    else {
      event.detail.result = 'shipSunk';
      event.detail.sunkShipName = _waitingPlayer.board.lastShipSunk;
    }
    event.detail.attackingPlayer = _currentPlayer;
    document.dispatchEvent(new CustomEvent('attackProcessed', event));
    if (gameOver) gameOverState();
    else {
      switchCurrentPlayer();
      inProgressState();
    }
  };
  const inProgressState = () => {
    if (_currentPlayer.type === 'ai') {
      const attack = _currentPlayer.makeMove();
      onPlayerAttack(attack, true);
    }
    document.dispatchEvent(
      new CustomEvent('gameInProgressState', {
        detail: {
          callback: onPlayerAttack
        }
      })
    );
  };

  const onReset = () => {
    _playerOne.board.reset();
    _playerTwo.board.reset();
    _playerOne.fleet.forEach((ship) => ship.reset());
    _playerTwo.fleet.forEach((ship) => ship.reset());
    _currentPlayer = _playerOne;
    _waitingPlayer = _playerTwo;
    if (isControllerInitialized()) startGame();
    else throw new Error('Error re-initializing controller after reset.');
  };
  const gameOverState = () => {
    const winner = _playerOne.board.allShipsSunk ? _playerTwo.name : _playerOne.name;
    document.dispatchEvent(
      new CustomEvent('gameOverState', {
        detail: {
          winner,
          callback: onReset
        }
      })
    );
  };

  // if(isControllerInitialized()) document.dispatchEvent(new CustomEvent('gameControllerInitialized', {
  //   detail: {

  //   }
  // }))
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
    switchCurrentPlayer,
    startGame,
    isControllerInitialized
  };
}
