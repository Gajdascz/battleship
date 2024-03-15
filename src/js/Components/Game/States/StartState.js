import { DEFAULT_FLEET } from '../../Fleet/common/fleetConstants';
import { PLAYERS, GAME_MODES } from '../../../Utility/constants/common';
import { initializePlayer } from '../utility/initializePlayer';
import { configureBoardControllers } from '../utility/PlayerBoardConfigurator';
import { EventManager } from '../../../Events/management/EventManager';
import { TurnManager } from '../utility/TurnManager';
const GameEventManager = (playerIds) => {
  let manager = null;
  const config = {
    global: {
      START_OVER: 'startStateOver',
      PLACEMENT_OVER: 'placementStateOver',
      PROGRESS_OVER: 'progressStateOver'
    },
    base: {
      turn: {
        START_TURN: 'startTurn',
        END_TURN: 'endTurn'
      },
      placement: {
        FINALIZE_PLACEMENT: 'finalizePlacement'
      },
      combat: {
        SEND_ATTACK: 'sendAttack',
        SEND_RESULT: 'sendIncomingAttackResult',
        SEND_SHIP_SUNK: 'shipSunk'
      }
    },
    scopes: playerIds
  };
  return {
    load: () => {
      if (!manager) manager = EventManager(config);
    },
    getScoped: (scope, eventType = null) => {
      let scopedEvents = manager.events.getScopedEvents()[scope];
      if (eventType) scopedEvents = scopedEvents[eventType];
      return scopedEvents;
    },
    getGlobal: () => manager.events.getGlobalEvents(),
    getBaseTypes: () => manager.events.getBaseTypes(),
    getEventMethods: () => ({ on: manager.on, off: manager.off, emit: manager.emit }),
    reset: () => manager.reset()
  };
};
const GameTurnManager = ({ p1Id, p2Id, eventManager }) => {
  let manager = null;
  const { emit, on, off } = eventManager.getEventMethods();
  const { getScoped, getBaseTypes } = eventManager;
  const turnEvents = getBaseTypes().TURN;
  const { START_TURN: p1StartTurn, END_TURN: p1EndTurn } = getScoped(p1Id, turnEvents);
  const { START_TURN: p2StartTurn, END_TURN: p2EndTurn } = getScoped(p2Id, turnEvents);
  return {
    load: () => {
      manager = TurnManager({
        emit,
        on,
        off,
        events: {
          p1StartTurn,
          p1EndTurn,
          p2StartTurn,
          p2EndTurn
        },
        p1Id,
        p2Id
      });
    },
    get: () => manager
  };
};

const initPlayers = ({ p1Settings, p2Settings, boardSettings }) => ({
  p1: initializePlayer({ playerSettings: p1Settings, boardSettings, fleetData: DEFAULT_FLEET }),
  p2: initializePlayer({ playerSettings: p2Settings, boardSettings, fleetData: DEFAULT_FLEET }),
  gameMode:
    p1Settings.type === PLAYERS.TYPES.HUMAN && p2Settings.type === PLAYERS.TYPES.AI
      ? GAME_MODES.HvA
      : GAME_MODES.HvH
});

export const StartState = () => {
  let eventManager = null;
  let turnManager = null;
  let players = null;

  const init = ({ data }) => {
    const { p1Settings, p2Settings, boardSettings } = data;
    console.log(data);
    const { p1, p2, gameMode } = initPlayers({ p1Settings, p2Settings, boardSettings });
    const [p1Id, p2Id] = [p1.model.id, p2.model.id];
    const { p1BoardController, p2BoardController } = configureBoardControllers(p1, p2, gameMode);
    players = {
      ids: [p1Id, p2Id],
      boardControllers: {
        [p1Id]: p1BoardController,
        [p2Id]: p2BoardController
      }
    };

    if (eventManager) eventManager.reset();
    eventManager = GameEventManager([p1Id, p2Id]);
    eventManager.load();

    if (turnManager) turnManager.reset();
    turnManager = GameTurnManager({
      p1Id,
      p2Id,
      eventManager
    });
    turnManager.load();
  };
  return {
    getPlayerControllers: () => players.boardControllers,
    getPlayerIds: () => players.ids,
    getEventManager: () => eventManager,
    getTurnManager: () => turnManager.get(),
    init,
    reset: () => {
      players = null;
      eventManager = null;
      turnManager = null;
    }
  };
};
