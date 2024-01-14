import PlayerManager from './managers/state-managers/PlayerStateManager';
import EventListenerManager from './managers/state-managers/EventListenerManager';
import StateManager from './managers/state-managers/StateTransitionManager';

import UIManager from './managers/interface-managers/UIManager';
import ElementManager from './managers/interface-managers/ElementManager';
import InterfaceInitializer from './interfaceInitializer';

import RenderStrategy from './renderStrategy';

import renderPlacementState from './game-states/placement-state/renderPlacementState';
import renderInProgressState from './game-states/progress-state/renderInProgressState';
import renderGameOverState from './game-states/over-state/renderGameOverState';

export default function RenderController() {
  const _playerManager = PlayerManager();
  const _stateTransitionEventManager = EventListenerManager();
  const _stateManager = StateManager();
  const _uiManager = UIManager();
  const _elementManager = ElementManager();
  const _interfaceInitializer = InterfaceInitializer();
  const _renderStrategy = { strategy: null };
  const _renderStrategyListenerManager = EventListenerManager();

  const tryCatch = (fn, { parameters }) => {
    try {
      fn(...parameters);
    } catch (error) {
      console.error(`Error in function call ${fn.name}`, error);
    }
  };

  const displayCurrent = () => {
    const container = _elementManager.getCachedElement('boardContainer');
    const playerDisplay = _elementManager.getCachedElement('currentPlayerDisplay');
    playerDisplay.textContent = _playerManager.currentPlayer.name;
    container.append(_playerManager.currentPlayerBoard);
  };

  const renderPlacementStateUI = (placementStateEvent) => {
    const { onPlacementSubmission } = placementStateEvent.detail;
    const currentPlayerFleetList = _playerManager.currentPlayerBoard.querySelector('.main-fleet-list');
    _stateManager.placementState(
      renderPlacementState,
      _playerManager.currentPlayerBoard,
      currentPlayerFleetList,
      onPlacementSubmission
    );
    displayCurrent();
  };

  // initiateRender(e, renderManager.current);
  // renderManager.current.addStateTransitionListeners({
  //   state: 'gamePlacementState',
  //   events: new Map([
  //     ['gamePlacementState', [renderPlacementStateUI]],
  //     ['placementsProcessed', [renderManager.current.clearState]],
  //     ['gameInProgressState', [renderInProgressStateUI]]
  //   ])
  // });
  // function renderPlacementStateUI(e) {
  //   const { callback } = e.detail;
  //   renderManager.current?.hideScreen?.();
  //   renderManager.current.syncCurrentPlayer();
  //   renderManager.current.placementState(callback);
  // }

  function initiate(gameStartedEvent) {
    const { boardOptions, playerOne, playerTwo, currentPlayer, waitingPlayer, gameMode } = gameStartedEvent.detail;
    const p1Board = _interfaceInitializer.buildGameBoardElement(boardOptions, playerOne.id, playerOne.fleet);
    const p2Board = _interfaceInitializer.buildGameBoardElement(boardOptions, playerTwo.id, playerTwo.fleet);
    _interfaceInitializer.initializeBaseInterface(_elementManager);
    _playerManager.initialize({
      currentPlayer,
      opponentPlayer: waitingPlayer,
      p1ID: playerOne.id,
      p2ID: playerTwo.id,
      p1Board,
      p2Board
    });
    const event = gameMode === 'HvH' ? 'turnConcluded' : 'playerSwitched';

    const switchPlayer = () => {
      _playerManager.switchCurrentPlayer();
      _uiManager.updateTextContent(
        _elementManager.getCachedElement('currentPlayerDisplay'),
        _playerManager.currentPlayer.name
      );
      _uiManager.updateContainer(_elementManager.getCachedElement('boardContainer'), _playerManager.currentPlayerBoard);
    };
    _renderStrategy.strategy = RenderStrategy(gameMode, p1Board, p2Board, playerTwo.name);
    _renderStrategyListenerManager.addListeners('switchPlayer', { [event]: [switchPlayer] });
    if (_renderStrategy.strategy !== null) {
      const onAttackProcessed = () => {
        const disableAttackCells = (cells) => cells.forEach((button) => button.setAttribute('disabled', 'true'));
        const enableEndTurnBtn = (board) => {
          board.querySelector('.end-turn-button').classList.remove('hide');
          board.querySelector('.end-turn-button').removeAttribute('disabled');
        };
        const board = _playerManager.currentPlayerBoard;
        const cells = board.querySelectorAll('.tracking-grid > button.grid-cell[data-status="unexplored"]');
        enableEndTurnBtn(board);
        disableAttackCells(cells);
      };
      const onTurnConcluded = () => {
        _renderStrategy.strategy.hideScreenDialog.playerName = _elementManager.getCachedElement('currentPlayerDisplay');
        _renderStrategy.strategy.hideScreenDialog.hideScreen();
      };
      _renderStrategyListenerManager.addListeners('attackProcessedStrategy', onAttackProcessed);
      _renderStrategyListenerManager.addListeners('onTurnConcludedStrategy', onTurnConcluded);
    }

    _stateTransitionEventManager.removeListener('gameInitializationState');
    _stateTransitionEventManager.addListeners('gamePlacementState', {
      gamePlacementState: [renderPlacementStateUI]
    });
  }
  tryCatch(_stateTransitionEventManager.addListeners, {
    parameters: ['gameInitializationState', { gameStarted: [initiate] }]
  });

  return {
    isInitialized: () => {
      return _playerManager.isInitialized() && _stateTransitionEventManager.hasListeners() && _stateManager.hasState();
    },
    reset: () => {
      _playerManager.reset();

      _stateTransitionEventManager.clearListeners();
      _stateManager.reset();
    }
  };
}
