import { globalEmitter } from '../../../Events/core/EventEmitter';
import { EventManager } from '../../../Events/management/EventManager';
import { GameStateController } from '../GameStateController';
import { STATES } from '../../../Utility/constants/common';
import { initializePlayer } from './initializePlayer';
import { DEFAULT_FLEET } from '../../Fleet/common/fleetConstants';

const PlayerTurnManager = ({ emit, p1Id, p2Id, events }) => {
  const { p1StartTurn, p1EndTurn, p2StartTurn, p2EndTurn } = events;
  const getEvent = {
    [p1Id]: {
      START: p1StartTurn,
      END: p1EndTurn
    },
    [p2Id]: {
      START: p2StartTurn,
      END: p2EndTurn
    }
  };
  const players = { current: p1Id, waiting: p2Id };
  const alternatePlayers = () =>
    ([players.current, players.waiting] = [players.waiting, players.current]);
  const getCurrentPlayer = () => players.current;
  const startCurrentPlayerTurn = () => emit(getEvent[players.current].START);
  const endCurrentPlayerTurn = () => emit(getEvent[players.current].END);
  return { alternatePlayers, getCurrentPlayer, startCurrentPlayerTurn, endCurrentPlayerTurn };
};
const AttackManager = ({ p1CombatData, p2CombatData, eventManager }) => {
  const { id: p1Id, handlers: p1Handlers, events: p1Events } = p1CombatData;
  const { id: p2Id, handlers: p2Handlers, events: p2Events } = p2CombatData;
  const { on, off, emit } = eventManager;
  const handlers = {
    [p1Id]: {
      incomingAttackHandler: p1Handlers.incomingAttackHandler,
      incomingResultHandler: p1Handlers.incomingResultHandler
    },
    [p2Id]: {
      incomingAttackHandler: p2Handlers.incomingAttackHandler,
      incomingResultHandler: p2Handlers.incomingResultHandler
    }
  };
  const togglePlayerIncomingAttackListener = (playerId, opponentId, events, isOn = false) => {
    if (isOn) on(events[opponentId].SEND_ATTACK, handlers[playerId].incomingAttackHandler);
    else off(events[opponentId].SEND_ATTACK, handlers[playerId].incomingAttackHandler);
  };

  const enableP1IncomingAttackListener = () => togglePlayerIncomingAttackListener(p1Id, p2Id, true);
  const disableP1IncomingAttackListener = () =>
    togglePlayerIncomingAttackListener(p1Id, p2Id, false);

  const enableP2IncomingAttackListener = () => togglePlayerIncomingAttackListener(p2Id, p1Id, true);
  const disableP2IncomingAttackListener = () =>
    togglePlayerIncomingAttackListener(p2Id, p1Id, false);

  on(p1Events.START_TURN, disableP1IncomingAttackListener);
  on(p1Events.END_TURN, enableP1IncomingAttackListener);
  on(p2Events.START_TURN, disableP2IncomingAttackListener);
  on(p2Events.END_TURN, enableP2IncomingAttackListener);
  on(p1Events.INCOMING_ATTACK_PROCESSED, handlers[p2Id].incomingResultHandler);
  on(p2Events.INCOMING_ATTACK_PROCESSED, handlers[p1Id].incomingResultHandler);

  return {
    sendP1Attack: (coordinates) => emit(p1Events.SEND_ATTACK, coordinates),
    sendP1Result: (result) => emit(p2Events.SEND_RESULT, result),
    sendP2Attack: (coordinates) => emit(p2Events.SEND_ATTACK, coordinates),
    sendP2Result: (result) => emit(p2Events.SEND_RESULT, result)
  };
};
const PlayerLossManager = ({ publish, eventManager, eventKey, hasLost, checkHasLostOn }) => {
  let isActive = true;
  let onLoss = null;
  const handleLossCheck = () => {
    if (!hasLost) return;
    if (onLoss) onLoss();
    publish(eventKey);
  };
  const activate = () => {
    if (isActive) return;
    eventManager.addActive(checkHasLostOn, handleLossCheck);
    isActive = true;
  };
  const deactivate = () => {
    if (!isActive) return;
    eventManager.removeActive(checkHasLostOn, handleLossCheck);
    isActive = false;
  };
  const reset = () => {
    deactivate();
    onLoss = null;
  };

  activate();
  return {
    onLoss: (callback) => (onLoss = callback),
    offLoss: () => (onLoss = null),
    activate,
    deactivate,
    reset
  };
};
export const GameCoordinator = () => {
  const players = {};
  const getEventsConfig = () => ({
    global: {
      SETTINGS_SUBMITTED: 'settingsSubmitted',
      ALL_PLAYERS_INITIALIZED: 'allPlayersInitialized',
      ALL_PLACEMENTS_FINALIZED: 'allPlacementsFinalized'
    },
    base: {
      START_TURN: 'startTurn',
      END_TURN: 'endTurn',
      SEND_ATTACK: 'sendAttack',
      SEND_RESULT: 'sendIncomingAttackResult',
      PLAYER_LOST: 'playerLost'
    },
    scopes: [Object.keys(players)]
  });
  const eventManager = EventManager(eventsConfig);
  const { on, off, offAll, emit, events } = eventManager;

  const globalEvents = events.getGlobalEvents();
  const scopedEvents = events.getScopedEvents();
  const p1Events = scopedEvents[p1Id];
  const p2Events = scopedEvents[p2Id];

  const turnManager = PlayerTurnManager({
    emit: eventManager.emit,
    p1Id,
    p2Id,
    events: {
      p1StartTurn: p1Events.START_TURN,
      p1EndTurn: p1Events.END_TURN,
      p2StartTurn: p2Events.START_TURN,
      p2EndTurn: p2Events.END_TURN
    }
  });

  const stateController = GameStateController([
    STATES.START,
    STATES.PLACEMENT,
    STATES.PROGRESS,
    STATES.OVER
  ]);
  const start = {
    settingsData: null,
    onStart: () => {
      const { p1Settings, p2Settings, boardSettings } = start.settingsData;
      const p1 = initializePlayer(p1Settings, boardSettings, DEFAULT_FLEET);
      const p2 = initializePlayer(p2Settings, boardSettings, DEFAULT_FLEET);

      start.settingsData = null;
      stateController.transitionTo(STATES.PLACEMENT);
    },
    catchSettingsData: (data) => {
      start.settingsData = data;
      stateController.onEnter(STATES.START, start.onStart);
      stateController.startGame(STATES.START);
    }
  };
  globalEmitter.subscribe(globalEvents.SETTINGS_SUBMITTED, start.catchSettingsData);
};
