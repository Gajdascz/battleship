import PlayerManager from '../managers/state/PlayerStateManager';
import EventListenerManager from '../managers/state/EventListenerManager';
import StateManager from '../managers/state/StateTransitionManager';

import UIManager from '../managers/interface/UIManager';
import ElementManager from '../managers/interface/ElementManager';
import InterfaceInitializer from './interfaceInitializer';

import RenderStrategy from './renderStrategy';

export default function RenderController() {
  const _playerManager = PlayerManager();
  const _stateTransitionEventManager = EventListenerManager();
  const _stateManager = StateManager();
  const _uiManager = UIManager();
  const _elementManager = ElementManager();
  const _interfaceInitializer = InterfaceInitializer(_elementManager);
  const _renderStrategy = { strategy: null };
  const _renderStrategyListenerManager = EventListenerManager();

  const swapBoards = () => {
    const boardContainer = _elementManager.getCachedElement('boardContainer');
    _uiManager.swapBoards(boardContainer, _playerManager.currentPlayerBoard);
  };
  const displayCurrentPlayerName = () => {
    const currentPlayerDisplay = _elementManager.getCachedElement('currentPlayerDisplay');
    _uiManager.displayCurrentPlayerName(currentPlayerDisplay, _playerManager.currentPlayer.name);
  };
  const syncDisplay = () => {
    swapBoards();
    displayCurrentPlayerName();
  };
  const switchPlayer = () => {
    _playerManager.switchCurrentPlayer();
    syncDisplay();
  };

  function initiate(gameStartedEvent) {
    const { boardOptions, playerOne, playerTwo, currentPlayer, waitingPlayer, gameMode } =
      gameStartedEvent.detail;
    const p1Board = _interfaceInitializer.buildGameBoardElement(
      boardOptions,
      playerOne.id,
      playerOne.fleet,
      _elementManager.cacheElement
    );
    const p2Board = _interfaceInitializer.buildGameBoardElement(
      boardOptions,
      playerTwo.id,
      playerTwo.fleet,
      _elementManager.cacheElement
    );
    _interfaceInitializer.initializeBaseInterface(_elementManager.cacheElement);
    _playerManager.initialize({
      currentPlayer,
      opponentPlayer: waitingPlayer,
      p1ID: playerOne.id,
      p2ID: playerTwo.id,
      p1Board,
      p2Board
    });

    _renderStrategy.strategy = RenderStrategy(
      gameMode,
      p1Board,
      p2Board,
      playerTwo.name,
      _elementManager
    );
    handleStrategyListeners(gameMode);
    syncDisplay();
  }

  const hideScreen = () => {
    const playerName = _playerManager.currentPlayer.name;
    _renderStrategy.strategy.setNextPlayerName(playerName);
    _renderStrategy.strategy.hideScreen();
  };

  const onTurnConcluded = () => {
    const enableAttackCells = (cells) =>
      cells.forEach((button) => button.removeAttribute('disabled'));
    hideScreen();
    const board = _playerManager.currentPlayerBoard;
    const cells = _elementManager.getUnexploredCells(board);
    enableAttackCells(cells);
  };

  const enableEndTurn = () => {
    const disableAttackCells = (cells) =>
      cells.forEach((button) => button.setAttribute('disabled', 'true'));
    const board = _playerManager.currentPlayerBoard;
    const cells = _elementManager.getUnexploredCells(board);
    disableAttackCells(cells);
    const fleetList = _elementManager.getCachedElement(
      `${_playerManager.currentPlayer.id}MainFleetList`
    );
    _renderStrategy.strategy.enableEndTurnBtn(fleetList);
  };

  const handleStrategyListeners = () => {
    try {
      if (_renderStrategy.strategy !== null) {
        _renderStrategyListenerManager.addListeners('switchPlayer', {
          turnConcluded: [switchPlayer]
        });
        _renderStrategyListenerManager.addListeners('placementsProcessedSwitchPlayer', {
          placementsProcessed: [switchPlayer, hideScreen]
        });
        _renderStrategyListenerManager.addListeners('turnConcluded', {
          turnConcluded: [onTurnConcluded]
        });
        _renderStrategyListenerManager.addListeners('attackProcessedEnableEndTurn', {
          attackProcessed: [enableEndTurn]
        });
        const p1FleetList = _elementManager.getMainFleetList(_playerManager.p1Board);
        const p2FleetList = _elementManager.getMainFleetList(_playerManager.p2Board);
        _elementManager.cacheElement(`playerOneMainFleetList`, p1FleetList);
        _elementManager.cacheElement(`playerTwoMainFleetList`, p2FleetList);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onPlacementState = (e) => {
    const { callback } = e.detail;
    const currentBoard = _playerManager.currentPlayerBoard;
    _stateManager.renderPlacementStateUI(
      currentBoard,
      _elementManager.getMainFleetList(currentBoard),
      callback
    );
  };
  const onInProgressState = (e) => {
    const { callback } = e.detail;
    const p1Board = _playerManager.p1Board;
    const p2Board = _playerManager.p2Board;
    _stateManager.renderInProgressStateUI(p1Board, p2Board, callback);
  };
  const onGameOverState = (e) => {
    const { winner } = e.detail;
    _stateManager.renderGameOverStateUI(winner);
  };
  const handleStateTransition = (e = { detail: { state: 'init' } }) => {
    const { state } = e.detail;
    try {
      switch (state) {
        case 'init': {
          _stateTransitionEventManager.addListeners('gameInitializationState', {
            gameStarted: [initiate]
          });
          _stateTransitionEventManager.addListeners('stateTransition', {
            stateTransitioned: [handleStateTransition]
          });
          _stateTransitionEventManager.addListeners('placementState', {
            gamePlacementState: [onPlacementState]
          });
          break;
        }
        case 'placement': {
          _stateTransitionEventManager.removeListener('gameInitializationState');
          _stateTransitionEventManager.addListeners('progressState', {
            gameInProgressState: [onInProgressState]
          });
          break;
        }
        case 'progress': {
          _stateTransitionEventManager.removeListener('placementState');
          _stateTransitionEventManager.addListeners('gameOverState', {
            gameOverState: [onGameOverState]
          });
          break;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  handleStateTransition();

  return {
    reset: () => {
      _playerManager.reset();
      _stateManager.reset();
      _elementManager.reset();
      _interfaceInitializer.reset();
      _stateTransitionEventManager.clearListeners();
      _renderStrategyListenerManager.clearListeners();
      if (_renderStrategy.strategy !== null) _renderStrategy.strategy.reset();
    }
  };
}
