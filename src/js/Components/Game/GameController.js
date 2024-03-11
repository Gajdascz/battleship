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
  const p1Id = p1BoardController.id;
  const p2Id = p2BoardController.id;
  const boardControllers = {
    [p1Id]: p1BoardController,
    [p2Id]: p2BoardController
  };
  const players = { current: p1Id, waiting: p2Id };
  const alternatePlayers = () =>
    ([players.current, players.waiting] = [players.waiting, players.current]);
  const placement = {
    managers: null,
    start: () =>
      (placement.managers = {
        [p1Id]: boardControllers[p1Id].getPlacementManager(),
        [p2Id]: boardControllers[p2Id].getPlacementManager()
      }),
    isOver: () => Object.values(placement.managers).every((manager) => manager.isOver()),
    getCurrentManager: () => placement.managers[players.current],
    end: () => {
      Object.values(placement.managers).forEach((manager) => manager.destruct());
      placement.managers = null;
    }
  };
  const combat = {
    managers: null,
    start: () => {},
    isOver: () => {},
    getCurrentManager: () => {},
    end: () => {}
  };
  return {
    alternatePlayers,
    placement
  };
};

export const GameController = () => {
  const emitter = EventEmitter();
  let stateController = null;
  let playerManager = null;
  const startGame = (data) => {
    stateController = GameStateController({
      emitter,
      transitionTriggers: {
        startTrigger: EVENTS.ALL_PLAYERS_INITIALIZED,
        placementTrigger: EVENTS.ALL_PLACEMENTS_FINALIZED,
        progressTrigger: EVENTS.PLAYER_LOST
      }
    });
    const { p1Settings, p2Settings, boardSettings } = data;
    const { p1BoardController, p2BoardController } = GameSessionInitializer({
      p1Settings,
      p2Settings,
      boardSettings,
      emitter
    });
    playerManager = PlayerManager(p1BoardController, p2BoardController);
    stateController.addOnEnterTo.placement(startPlacementState);
    stateController.addOnExitTo.placement(playerManager.placement.end);
    stateController.addOnEnterTo.progress(startProgressState);
    stateController.startGame();
    emitter.publish(EVENTS.ALL_PLAYERS_INITIALIZED);
  };

  const startPlacementState = () => {
    const onTurnEnd = () => {
      playerManager.alternatePlayers();
      if (playerManager.placement.isOver()) emitter.publish(EVENTS.ALL_PLACEMENTS_FINALIZED);
      else executeCurrent();
    };
    const executeCurrent = () => {
      const manager = playerManager.placement.getCurrentManager();
      manager.initialize();
      manager.onEndTurn(onTurnEnd);
      manager.startTurn();
    };
    playerManager.placement.start();
    executeCurrent();
  };

  const startProgressState = () => {
    console.log('progress Reached');
  };

  return {
    startGame
  };
};
