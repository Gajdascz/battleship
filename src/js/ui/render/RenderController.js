import PlayerManager from '../managers/state/PlayerStateManager';
import EventListenerManager from '../managers/general/EventListenerManager';
import StateManager from '../managers/state/StateTransitionManager';

import UIManager from '../managers/interface/UIManager';
import ElementManager from '../managers/interface/ElementManager';
import InterfaceInitializer from './interfaceInitializer';

import RenderStrategy from './renderStrategy';
import { buildShipComponent } from '../components/_builders/Ship/buildShipComponent';

export default function RenderController() {
  const VALIDATE_LISTENERS = true;

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

  const initializePlayerFleet = (fleet) => {
    console.log(fleet);
    const controllers = fleet.map((ship) => buildShipComponent(ship.name, ship.length));
    console.log(controllers);
  };

  function initiate(gameStartedEvent) {
    const { boardOptions, playerOne, playerTwo, currentPlayer, waitingPlayer, gameMode } =
      gameStartedEvent.detail;
    initializePlayerFleet(playerOne.fleet);
    initializePlayerFleet(playerOne.fleet);
    console.log(playerOne);
    const p1BoardController = _interfaceInitializer.initializeBoardController(
      boardOptions,
      playerOne.id
    );
    const p2BoardController = _interfaceInitializer.initializeBoardController(
      boardOptions,
      playerTwo.id
    );
    const p1FleetManager = _interfaceInitializer.initializeFleetManager(playerOne.fleet);
    const p2FleetManager = _interfaceInitializer.initializeFleetManager(playerTwo.fleet);
    p1BoardController.populateFleetLists(
      p1FleetManager.getAllShipElements(),
      p1FleetManager.getAllTrackingShipElements()
    );
    p2BoardController.populateFleetLists(
      p2FleetManager.getAllShipElements(),
      p2FleetManager.getAllTrackingShipElements()
    );

    playerOne.boardController = p1BoardController;
    playerTwo.boardController = p2BoardController;
    playerOne.fleetManager = p1FleetManager;
    playerTwo.fleetManager = p2FleetManager;

    _interfaceInitializer.initializeBaseInterface(_elementManager.cacheElement);
    _playerManager.initialize({
      currentPlayer,
      opponentPlayer: waitingPlayer
    });

    _renderStrategy.strategy = RenderStrategy(
      gameMode,
      // p1BoardController.element,
      // p2BoardController.element,
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

  const alternatePlayers = () => {
    switchPlayer();
    hideScreen();
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
        _renderStrategyListenerManager.addListenerData({
          key: 'switchPlayer',
          triggerFunctionObj: { turnConcluded: [switchPlayer] },
          validate: VALIDATE_LISTENERS
        });
        _renderStrategyListenerManager.addListenerData({
          key: 'placementsProcessedSwitchPlayer',
          triggerFunctionObj: { placementsProcessed: [alternatePlayers] },
          validate: VALIDATE_LISTENERS
        });
        _renderStrategyListenerManager.addListenerData({
          key: 'turnConcluded',
          triggerFunctionObj: { turnConcluded: [onTurnConcluded] },
          validate: VALIDATE_LISTENERS
        });
        _renderStrategyListenerManager.addListenerData({
          key: 'attackProcessedEnableEndTurn',
          triggerFunctionObj: { attackProcessed: [enableEndTurn] },
          validate: VALIDATE_LISTENERS
        });
        _renderStrategyListenerManager.attachAllListeners();
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
    // const { callback } = e.detail;
    // const currentBoard = _playerManager.currentPlayerBoard;
    // _stateManager.renderPlacementStateUI(
    //   currentBoard,
    //   _elementManager.getMainFleetList(currentBoard),
    //   callback
    // );
    //  _stateManager.renderPlacementStateUI(currentBoard, _playerManager.p1FleetManager, callback);
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
          _stateTransitionEventManager.addListenerData({
            key: 'gameInitializationState',
            triggerFunctionObj: { gameInitializationState: [initiate] },
            validate: VALIDATE_LISTENERS
          });
          _stateTransitionEventManager.addListenerData({
            key: 'stateTransition',
            triggerFunctionObj: { stateTransitioned: [handleStateTransition] }
          });
          _stateTransitionEventManager.addListenerData({
            key: 'placementState',
            triggerFunctionObj: { gamePlacementState: [onPlacementState] }
          });
          _stateTransitionEventManager.attachAllListeners();
          break;
        }
        case 'placement': {
          _stateTransitionEventManager.destructListener('gameInitializationState');
          _stateTransitionEventManager.addListenerData('progressState', {
            key: 'progressState',
            triggerFunctionObj: { gameInProgressState: [onInProgressState] }
          });
          break;
        }
        case 'progress': {
          _stateTransitionEventManager.destructListener('placementState');
          _stateTransitionEventManager.addListenerData({ gameOverState: [onGameOverState] });
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
      _stateTransitionEventManager.destructAllListenerData();
      _renderStrategyListenerManager.destructAllListenerData();
      if (_renderStrategy.strategy !== null) _renderStrategy.strategy.reset();
    }
  };
}
