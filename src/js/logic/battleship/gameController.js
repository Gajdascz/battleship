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
    document.dispatchEvent(new CustomEvent('playerSwitched', { detail: { currentPlayer: _currentPlayer } }));
  };

  const isPlacementState = () => {
    return (
      !(_playerOne.board.placedShips === _playerOne.fleet.length) ||
      !(_playerTwo.board.placedShips === _playerTwo.fleet.length)
    );
  };
  const isInProgressState = () => !isPlacementState() && !isGameOverState();

  const isGameOverState = () => _playerOne.board.allShipsSunk || _playerTwo.board.allShipsSunk;

  const startGame = () => {
    if (_playerOne.type === 'ai') _playerOne.initializeAvailableMoves();
    if (_playerTwo.type === 'ai') _playerTwo.initializeAvailableMoves();
    document.dispatchEvent(
      new CustomEvent('gameStarted', {
        detail: {
          gameMode: _gameMode,
          boardOptions: _boardOptions,
          playerOne: _playerOne,
          playerTwo: _playerTwo,
          currentPlayer: _currentPlayer
        }
      })
    );
    placementState();
  };

  const placementState = () => {
    if (_currentPlayer.type === 'ai') {
      _currentPlayer.placeShips();
      switchCurrentPlayer();
    }
    if (isInProgressState()) inProgressState();
    else {
      document.dispatchEvent(
        new CustomEvent('gamePlacementState', {
          detail: {
            callback: onPlacementSubmission
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
  const gameOverState = () => {
    document.dispatchEvent(new CustomEvent('gameOverState'));
  };

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
    startGame
  };
}
