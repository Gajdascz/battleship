import { DEFAULT_FLEET, PLAYERS, GAME_MODES } from '../../../Utility/constants/common';
import { initializePlayer } from '../utility/initializePlayer';
import { configureBoardControllers } from '../utility/configurePlayerBoardControllers';
import { EventManager } from '../../../Events/management/EventManager';
import { TurnManager } from '../Managers/TurnManager';
import { PlayerManager } from '../Managers/PlayerManager';

const GameEventManager = (playerIds) => {
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
  return EventManager(config);
};

const extractEventManagerInterface = (manager) => ({
  getScoped: (scope, eventType = null) => {
    let scopedEvents = manager.events.getScopedEvents()[scope];
    if (eventType) scopedEvents = scopedEvents[eventType];
    return scopedEvents;
  },
  getGlobal: manager.events.getGlobalEvents,
  getBaseTypes: manager.events.getBaseTypes,
  getEventMethods: () => ({ on: manager.on, off: manager.off, emit: manager.emit }),
  reset: manager.reset
});

const GameTurnManager = ({ p1Id, p2Id, eventManager }) => {
  const { emit, on, off } = eventManager.getEventMethods();
  const { getScoped, getBaseTypes } = eventManager;
  const turnEvents = getBaseTypes().TURN;
  const { START_TURN: p1StartTurn, END_TURN: p1EndTurn } = getScoped(p1Id, turnEvents);
  const { START_TURN: p2StartTurn, END_TURN: p2EndTurn } = getScoped(p2Id, turnEvents);
  return TurnManager({
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
};

const initPlayers = ({ p1Settings, p2Settings, boardSettings }) => ({
  p1: initializePlayer({ playerSettings: p1Settings, boardSettings, fleetData: DEFAULT_FLEET }),
  p2: initializePlayer({ playerSettings: p2Settings, boardSettings, fleetData: DEFAULT_FLEET }),
  gameMode: `${p1Settings.type.charAt(0).toUpperCase()}v${p2Settings.type.charAt(0).toUpperCase()}`
});

export const StartStateCoordinator = (settings) => {
  const { p1Settings, p2Settings, boardSettings } = settings;
  const { p1, p2, gameMode } = initPlayers({ p1Settings, p2Settings, boardSettings });
  const [p1Id, p2Id] = [p1.model.id, p2.model.id];
  const { p1BoardController, p2BoardController } = configureBoardControllers(p1, p2, gameMode);
  const playerManager = PlayerManager({
    ids: [p1Id, p2Id],
    names: {
      [p1Id]: p1.model.getName(),
      [p2Id]: p2.model.getName()
    },
    controllers: {
      [p1Id]: p1BoardController,
      [p2Id]: p2BoardController
    },
    controllerTypes: {
      PLACEMENT: 'placement',
      COMBAT: 'combat'
    },
    gameMode
  });
  const eventManager = extractEventManagerInterface(GameEventManager([p1Id, p2Id]));
  const turnManager = GameTurnManager({
    p1Id,
    p2Id,
    eventManager
  });
  return {
    playerManager,
    eventManager,
    turnManager
  };
};
