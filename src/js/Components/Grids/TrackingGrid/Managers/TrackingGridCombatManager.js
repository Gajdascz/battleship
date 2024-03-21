// Tracking Grid Component
import { TrackingGridCombatView } from '../main/view/TrackingGridCombatView';
import { ManagerFactory } from '../../../../Utility/ManagerFactory';
import { convertToInternalFormat } from '../../../../Utility/utils/coordinatesUtils';

const TRACKING_GRID_COMBAT_EVENTS = {
  ATTACK_SENT: 'attackSent',
  RESUlT_PROCESSED: 'sentAttackResultProcessed'
};

/**
 * Initializes a TrackingGridCombatManager which provides cross-component event-driven combat related communication.
 *
 * @param {Object} detail Initialization detail.
 * @param {Object} detail.view Tracking grid view interface.
 * @param {function} detail.createHandler Function to create event handler.
 * @returns {Object} Interface for tracking grid combat functionality.
 */
const TrackingGridCombatManager = ({ view, createHandler }) => {
  const combatView = TrackingGridCombatView(view);

  /**
   * @typedef {Object} acceptResult Encapsulates outgoing result logic and event communication.
   * @property {function()} process Updates the grid's view based on the received result of a sent outgoing attack.
   * @property {function(function)} on Subscribes a callback to execute when the result processed event occurs.
   * @property {function(function)} off Unsubscribes a callback from the result processed event.
   * @property {function()} initialize Creates an event handler for the result processed event.
   * @property {function()} end Resets the event handler.
   */
  /** @type {acceptResult} */
  const acceptResult = {
    handler: null,
    process: ({ data }) => {
      const { result } = data;
      combatView.displayResult(result);
      acceptResult.handler.emit();
    },
    on: (callback) => acceptResult.handler.on(callback),
    off: (callback) => acceptResult.handler.off(callback),
    initialize: () =>
      (acceptResult.handler = createHandler(TRACKING_GRID_COMBAT_EVENTS.RESUlT_PROCESSED)),
    end: () => outgoingAttack.handler.reset()
  };

  /**
   * @typedef {Object} outgoingAttack Encapsulates outgoing attack logic and event communication.
   * @property {function()} send Emits an outgoing attack request event.
   * @property {function(function)} on Subscribes a callback to execute when the outgoing attack request event is emitted.
   * @property {function(function)} off Unsubscribes a callback from the outgoing attack request event.
   * @property {function()} initialize Creates an event handler for the outgoing attack sent event.
   * @property {function()} enable Allows attacks to be sent from the interface.
   * @property {function()} disable Prevents attacks from being sent from the interface.
   * @property {function()} end Resets the event handler.
   */
  /** @type {outgoingAttack} */
  const outgoingAttack = {
    handler: null,
    send: (displayCoordinates) => {
      const coordinates = convertToInternalFormat(displayCoordinates);
      outgoingAttack.handler.emit(coordinates);
    },
    enable: () => combatView.enable(),
    disable: () => combatView.disable(),
    on: (callback) => outgoingAttack.handler.on(callback),
    off: (callback) => outgoingAttack.handler.off(callback),
    initialize: () =>
      (outgoingAttack.handler = createHandler(TRACKING_GRID_COMBAT_EVENTS.ATTACK_SENT)),
    end: () => outgoingAttack.handler.reset()
  };

  /**
   * Initializes tracking grid event handlers and assigns the send outgoing attack request event to the interface.
   */
  const start = () => {
    outgoingAttack.initialize();
    acceptResult.initialize();
    combatView.initialize(outgoingAttack.send);
  };

  /**
   * Resets the event handlers and disables attacks.
   */
  const end = () => {
    outgoingAttack.end();
    combatView.end();
    acceptResult.end();
  };

  return {
    start,
    end,
    enable: outgoingAttack.enable,
    disable: outgoingAttack.disable,
    acceptResult: acceptResult.process,
    onResultProcessed: acceptResult.on,
    offResultProcessed: acceptResult.off,
    onSendAttack: outgoingAttack.on,
    offSendAttack: outgoingAttack.off
  };
};

export const CombatManagerFactory = ({ view, createHandler }) =>
  ManagerFactory({
    ManagerBuilder: TrackingGridCombatManager,
    initialDetails: { view, createHandler },
    validateDetails: (details) => details.view && details.createHandler
  });
