import { globalEmitter } from '../../../Events/core/EventEmitter';
import { EventManager } from '../../../Events/management/EventManager';
import { GameStateController } from '../GameStateController';
import { PLAYERS, GAME_MODES, STATES } from '../../../Utility/constants/common';
import { initializePlayer } from './initializePlayer';
import { DEFAULT_FLEET } from '../../Fleet/common/fleetConstants';
import { configureBoardControllers } from './PlayerBoardConfigurator';
import { TurnManager } from './TurnManager';
import { CombatManager } from './CombatManager';

const getEventsConfig = (scopes) => ({
  global: {
    ALL_PLAYERS_INITIALIZED: 'allPlayersInitialized',
    ALL_PLACEMENTS_FINALIZED: 'allPlacementsFinalized',
    PLAYER_LOST: 'playerLost'
  },
  base: {
    START_TURN: 'startTurn',
    END_TURN: 'endTurn',
    FINALIZE_PLACEMENT: 'finalizePlacement',
    SEND_ATTACK: 'sendAttack',
    SEND_RESULT: 'sendIncomingAttackResult',
    SEND_SHIP_SUNK: 'shipSunk'
  },
  scopes
});
export const GameCoordinator = (startGameEvent) => {
  const players = {};
  const stateController = GameStateController([
    STATES.START,
    STATES.PLACEMENT,
    STATES.PROGRESS,
    STATES.OVER
  ]);
  let turnManager = null;
  let p1Id;
  let p2Id;
  const events = (() => {
    let manager = null;
    return {
      loadManager: () => {
        if (!manager) manager = EventManager(getEventsConfig(Object.keys(players)));
      },
      getScoped: (scope) => manager.events.getScopedEvents()[scope],
      getEventMethods: () => ({ on: manager.on, off: manager.off, emit: manager.emit })
    };
  })();

  const loadTurnManager = (p1Id, p2Id) => {
    if (turnManager || !p1Id || !p2Id) return;
    events.loadManager();
    const { emit, on, off } = events.getEventMethods();
    const p1Events = events.getScoped(p1Id);
    const p2Events = events.getScoped(p2Id);
    turnManager = TurnManager({
      emit,
      on,
      off,
      events: {
        p1StartTurn: p1Events.START_TURN,
        p1EndTurn: p1Events.END_TURN,
        p2StartTurn: p2Events.START_TURN,
        p2EndTurn: p2Events.END_TURN
      },
      p1Id,
      p2Id
    });
  };

  const start = {
    settingsData: null,
    onStart: () => {
      const { p1Settings, p2Settings, boardSettings } = start.settingsData;
      const gameMode =
        p1Settings.type === PLAYERS.TYPES.HUMAN && p2Settings.type === PLAYERS.TYPES.AI
          ? GAME_MODES.HvA
          : GAME_MODES.HvH;
      const p1 = initializePlayer(p1Settings, boardSettings, DEFAULT_FLEET);
      const p2 = initializePlayer(p2Settings, boardSettings, DEFAULT_FLEET);
      const p1Id = p1.model.id;
      const p2Id = p2.model.id;
      const { p1BoardController, p2BoardController } = configureBoardControllers(p1, p2, gameMode);
      players[p1Id] = p1BoardController;
      players[p2Id] = p2BoardController;
      events.loadManager();
      loadTurnManager(p1Id, p2Id);
      start.settingsData = null;
      stateController.onEnter(STATES.PLACEMENT, placement.executeCurrent);
      stateController.transitionTo(STATES.PLACEMENT);
    },
    catchSettingsData: ({ data }) => {
      start.settingsData = data;
      stateController.onEnter(STATES.START, start.onStart);
      stateController.startGame(STATES.START);
    }
  };
  const placement = {
    finalized: {},
    onFinalize: ({ data }) => {
      placement.finalized[data] = true;
      turnManager.switchTurns();
      if (Object.keys(players).every((id) => placement.finalized[id])) {
        stateController.transitionTo(STATES.PROGRESS);
      } else placement.executeCurrent();
    },
    setupFinalizeEvent: (id) => {
      const { on, off, emit } = events.getEventMethods();
      const scopedEvents = events.getScoped(id);
      const finalizeEvent = scopedEvents.FINALIZE_PLACEMENT;
      on(finalizeEvent, placement.onFinalize);
      const finalizePlacement = () => {
        emit(finalizeEvent, id);
        off(finalizeEvent, placement.onFinalize);
      };
      return finalizePlacement;
    },
    executeCurrent: () => {
      const currentId = turnManager.getCurrentPlayer();
      const onFinalize = placement.setupFinalizeEvent(currentId);
      players[currentId].placement.start(onFinalize);
    }
  };
  const combat = {
    attackManager: null,
    loadManager: () => {
      if (combat.attackManager) return;
      const p1BoardController = players[p1Id];
      const p2BoardController = players[p2Id];
      combat.attackManager = AttackManager({
        p1CombatData,
        p2CombatData,
        eventManager: events
      });
    }
  };
  globalEmitter.subscribe(startGameEvent, start.catchSettingsData);
};
