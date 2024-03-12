import { AttackCoordinator } from './AttackCoordinator';
import { BaseState } from './BaseState';
import { TurnManager } from './TurnManager';
/**
 * @module GameCoordinator
 * Coordinates the state-specific communication between two opponents using an event-driven architecture.
 * It defines a unified and extendable interface for communicating state-specific actions.
 * Utilizing a shared emitter, it provides a communication channel between players, allowing for turn-based
 * mechanics and state updates. The module integrates with the AttackCoordinator for handling attack logistics
 * and BaseState for ensuring state-specific interface consistency. Each game instance is encapsulated,
 *
 * @param {Object} emitterBundle An object containing the shared emitter and utility functions for event key generation.
 * @returns {Object} An extendable object exposing interfaces for the placement and combat phases of the game.
 *
 */
export const GameCoordinator = (emitterBundle) => {
  const isFn = (fn) => typeof fn === 'function';
  const resetFns = [];
  const turnManager = TurnManager(emitterBundle);

  const subscribeEndTurn = (callback) => turnManager.thisEnd.on(callback);
  const unsubscribeEndTurn = (callback) => turnManager.thisEnd.off(callback);

  const implementStateBase = ({ state, callbacks }) => {
    const { initialize, startTurn, endTurn } = callbacks;
    state.implementBase(state.BASE_METHODS.INITIALIZE, initialize);
    state.implementBase(state.BASE_METHODS.START_TURN, startTurn);
    state.implementBase(state.BASE_METHODS.END_TURN, endTurn);
  };

  const PlacementState = () => {
    const state = BaseState();
    implementStateBase({
      state,
      callbacks: {
        initialize: () => {},
        startTurn: () => turnManager.publishStart(),
        endTurn: () => turnManager.publishEnd()
      }
    });
    const reset = () => {
      state.reset();
    };
    resetFns.push(() => reset);
    return {
      call: state.call,
      add: state.add,
      extend: state.extend,
      BASE_METHODS: state.BASE_METHODS,
      reset
    };
  };

  const CombatState = () => {
    const { emitter, getPlayerEventKey, getOpponentEventKey } = emitterBundle;
    const state = BaseState();
    let coordinator = null;
    let hasStarted = null;
    const COMBAT_METHODS = {
      ...state.BASE_METHODS,
      SEND_ATTACK: 'sendAttack',
      SEND_RESULT: 'sendResult'
    };
    implementStateBase({
      state,
      callbacks: {
        initialize: ({ incomingAttackHandler, sentAttackResultHandler }) => {
          if (hasStarted) return;
          if (!isFn(incomingAttackHandler) || !isFn(sentAttackResultHandler))
            throw new Error('Cannot initialize combat with invalid handlers.');
          coordinator = AttackCoordinator({
            incomingAttackHandler,
            sentAttackResultHandler,
            emitterBundle
          });
          hasStarted = true;
          turnManager.thisStart.on(coordinator.disableIncoming);
          turnManager.otherStart.on(coordinator.enableIncoming);
        },
        startTurn: () => {
          console.log(`${emitterBundle.getPlayerEventKey(`'s`)} started in coordinator`);
          turnManager.publishStart();
        },
        endTurn: () => turnManager.publishEnd()
      }
    });
    state.add(COMBAT_METHODS.SEND_ATTACK, (coordinates) => coordinator.sendAttack(coordinates));
    state.add(COMBAT_METHODS.SEND_RESULT, (result) => coordinator.sendResult(result));

    const reset = () => {
      state.reset();
      coordinator.reset();
      turnManager.reset();
    };
    resetFns.push(() => reset);

    return {
      call: state.call,
      add: state.add,
      extend: state.extend,
      BASE_METHODS: COMBAT_METHODS,
      reset
    };
  };

  const placement = PlacementState();
  const combat = CombatState();

  const reset = () => resetFns.forEach((fn) => fn());

  return {
    placement,
    combat,
    subscribeEndTurn,
    unsubscribeEndTurn,
    reset
  };
};
