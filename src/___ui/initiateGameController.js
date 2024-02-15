import initializeGameObjects from './initializeGameObjects';
import { RESULTS } from '../../utility/constants/constants';

/**
 * @module initiateGameController.js
 * Central controller for managing and tracking the state and flow of a game session.
 * Uses an event-driven approach to communicate with and provide information to the UI.
 *
 */

/**
 * Initiates the game's flow and state.
 *
 * @param {Object} - Object containing configuration settings.
 * @param {Object} playerOneInformation - Contains player type and name.
 * @param {Object} playerTwoInformation - Contains player type, name, and difficulty if AI.
 * @param {Object} boardOptions - Contains rows, columns, and letterAxis.
 */
export default function initiateGameController({
  playerOneInformation = { type: 'human', name: '' },
  playerTwoInformation = { type: 'ai', name: '', difficulty: 0 },
  boardOptions = { rows: 10, cols: 10, letterAxis: 'row' }
} = {}) {
  // Initializes core game entities.
  const { _playerOne, _playerTwo, _fleet, _gameMode, _boardOptions } = initializeGameObjects(
    playerOneInformation,
    playerTwoInformation,
    boardOptions
  );
  let _currentPlayer = _playerOne;
  let _waitingPlayer = _playerTwo;

  // Alternates players and triggers an event to reflect the change.
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

  // Validates controller initialization for game integrity and error handling.
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

  // Verifies players' fleet placements to ensure correct state transition.
  const isShipsPlaced = (player) => player.board.placedShips === player.fleet.length;

  // Checks the games state to ensure proper state consistency and transitioning.
  const isPlacementState = () => !isShipsPlaced(_playerOne) || !isShipsPlaced(_playerTwo);
  const isInProgressState = () => !isPlacementState() && !isGameOverState();
  const isGameOverState = () => _playerOne.board.allShipsSunk || _playerTwo.board.allShipsSunk;

  /**
   * Manages transitions between game states.
   * Dispatches events to update the UI and also executes state-specific logic.
   *
   * @param {function} stateFn - Function to execute transitioned state's logic.
   * Dispatches:
   * - 'stateTransitioned' event containing a string representation of the new game state.
   */
  const transition = (stateFn) => {
    document.dispatchEvent(
      new CustomEvent('stateTransitioned', {
        detail: {
          state: getState()
        }
      })
    );
    stateFn();
  };

  /**
   * Initiates the game.
   * Dispatches essential game information and verifies the readiness of the game controller.
   * Dispatches:
   * - 'gameStarted' event containing string representations of the game mode and board options,
   *    along with the playerOne, playerTwo, currentPlayer, and waitingPlayer Objects.
   */
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
    if (!isControllerInitialized()) throw new Error('GameController Not properly Initialized.');
    transition(placementState);
  };

  /**
   * Manages the ship placement phase.
   * Automates AI placements if applicable, and transitions to the progress state upon completion.
   * Dispatches:
   *  - 'gamePlacementState' containing the onPlacementSubmission callback function for processing
   *                         submitted placements.
   */
  const placementState = () => {
    if (_currentPlayer.type === 'ai' && !isShipsPlaced(_currentPlayer)) {
      _currentPlayer.initializeShipPlacement();
      switchCurrentPlayer();
    }
    if (isInProgressState()) transition(inProgressState);
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

  /**
   * Handles the submission of ship placements.
   * Updates the game board and transitioning the active player or game state as needed.
   *
   * @param {object} placementDetails - Event detail containing the placement request details.
   * Dispatches:
   *  - 'placementsProcessed' contains no event details. Used to be responded to for updating the
   *                          user interface.
   */
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
    else transition(inProgressState);
  };

  /**
   * Manages attack mechanics.
   * Updates game state based on attack outcomes, and coordinates AI attacks when necessary.
   *
   * @param {object} attack - An Event Object or a literal Object provided by the AI.
   * @param {boolean} aiAttacked - Flag for recursively processing AI attacks.
   * Dispatches:
   *  - 'attackProcessed' event containing the details of the attack, including the result,
   *                      coordinates, and sunken ship name if relevant.
   */
  const onPlayerAttack = (attack, aiAttacked = false) => {
    const event = { detail: { callback: onPlayerAttack } };
    const coordinates = aiAttacked ? attack.move : attack.detail.coordinates;
    const result = aiAttacked
      ? attack.result
      : _currentPlayer.board.outgoingAttack(coordinates, _waitingPlayer.board);
    event.detail.coordinates = coordinates;
    processAttack(event.detail, result);
    document.dispatchEvent(new CustomEvent('attackProcessed', event));
    if (isGameOverState() || result === RESULTS.ALL_SHIPS_SUNK) transition(gameOverState);
    else {
      switchCurrentPlayer();
      if (_currentPlayer.type === 'ai' && !aiAttacked) {
        onPlayerAttack(_currentPlayer.makeMove(), true);
      }
    }
  };

  /**
   * Processes attack.
   * Populates the event detail to be dispatched for state and interface updates.
   *
   * @param {object} detail - Event detail to populate
   * @param {integer|boolean} result - Representation of attack result.
   */
  const processAttack = (detail, result) => {
    detail.attackingPlayer = _currentPlayer;
    switch (result) {
      case RESULTS.ALL_SHIPS_SUNK:
        detail.result = RESULTS.ALL_SHIPS_SUNK;
        detail.sunkShipName = _waitingPlayer.board.lastShipSunk;
        break;
      case RESULTS.MISS:
        detail.result = RESULTS.MISS;
        break;
      case RESULTS.HIT:
        detail.result = RESULTS.HIT;
        break;
      case RESULTS.SHIP_SUNK:
        detail.result = RESULTS.SHIP_SUNK;
        detail.sunkShipName = _waitingPlayer.board.lastShipSunk;
        break;
      default:
        throw new Error(`Invalid Attack Result: ${result}`);
    }
  };

  /**
   * Facilitates the transition from ship placement to active game play.
   * Sets up the necessary event handling for player attacks.
   * Dispatches:
   *  - 'onPlayerAttack' callback function for processing player attacks.
   */
  const inProgressState = () => {
    document.dispatchEvent(
      new CustomEvent('gameInProgressState', {
        detail: {
          callback: onPlayerAttack
        }
      })
    );
  };

  /**
   * Concludes the game.
   * Determines and provides the winner, and transitioning to the game over state.
   * Dispatches:
   *  - 'gameOverState' event containing the name of the winning player.
   */
  const gameOverState = () => {
    const winner = _playerOne.board.allShipsSunk ? _playerTwo.name : _playerOne.name;
    document.dispatchEvent(
      new CustomEvent('gameOverState', {
        detail: {
          winner
        }
      })
    );
  };

  // Returns a string of the current game state to be dispatched in the transition event detail.
  const getState = () => {
    if (isPlacementState()) return 'placement';
    else if (isInProgressState()) return 'progress';
    else if (isGameOverState()) return 'over';
    else return 'Error';
  };
  startGame();
}
