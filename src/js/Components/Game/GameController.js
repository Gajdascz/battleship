import { GameSessionInitializer } from './utility/GameSessionInitializer';
import { GameStateController } from './GameStateController';
import { globalEmitter } from '../../Events/core/globalEventEmitter';
import { GAME_EVENTS } from './common/gameEvents';
import { EventScopeManager } from '../../Events/management/EventScopeManager';
import { EventEmitter } from '../../Events/core/EventEmitter';
import { STATES } from '../../Utility/constants/common';

const EVENTS = {
  SETTINGS_SUBMITTED: 'settingsSubmitted',
  ALL_PLAYERS_INITIALIZED: 'allPlayersInitialized',
  ALL_PLACEMENTS_FINALIZED: 'allPlayerPlacementsFinalized',
  PLAYER_LOST: 'playerLost'
};

const PlayerManager = (p1BoardController, p2BoardController) => {
  const boardControllers = {
    [p1BoardController.getId()]: p1BoardController,
    [p2BoardController.getId()]: p2BoardController
  };
  const players = { current: p1BoardController.getId(), waiting: p2BoardController.getId() };
  const alternatePlayers = () =>
    ([players.current, players.waiting] = [players.waiting, players.current]);
  const getCurrentBoardController = () => boardControllers[players.current];
  const getCurrentPlacementManager = () => getCurrentBoardController().placementManager;
  return {
    alternatePlayers,
    getCurrentPlayerEventKey: (event) => getCurrentBoardController().getPlayerEventKey(event),
    getWaitingPlayerEventKey: (event) =>
      boardControllers[p2BoardController.getId()].getPlayerEventKey(event),
    getCurrentPlacementManager
  };
};

export const GameController = () => {
  const emitter = EventEmitter();
  let stateController = null;
  let playerManager = null;
  const initializeStateController = () => {
    stateController = GameStateController({
      emitter,
      transitionTriggers: {
        startTrigger: EVENTS.ALL_PLAYERS_INITIALIZED,
        placementTrigger: EVENTS.ALL_PLACEMENTS_FINALIZED,
        progressTrigger: EVENTS.PLAYER_LOST
      }
    });
    stateController.addOnEnterTo.placement(startPlacementState);
  };

  const startGame = (data) => {
    initializeStateController();
    stateController.startGame();
    const { p1Settings, p2Settings, boardSettings } = data;
    const { p1BoardController, p2BoardController } = GameSessionInitializer({
      p1Settings,
      p2Settings,
      boardSettings,
      emitter
    });
    playerManager = PlayerManager(p1BoardController, p2BoardController);
    emitter.publish(EVENTS.ALL_PLAYERS_INITIALIZED);
  };

  const startPlacementState = () => {
    let placementManager = null;
    const executeCurrent = () => {
      placementManager = playerManager.getCurrentPlacementManager();
      placementManager.initialize();
      placementManager.startTurn();
    };
    executeCurrent();
  };

  const startProgressState = () => {
    let currentController = null;
  };

  return {
    startGame
  };
};
