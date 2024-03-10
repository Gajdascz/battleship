import { AttackCoordinator } from './AttackCoordinator';
import { BaseState } from './BaseState';
import { GAME_EVENTS } from '../common/gameEvents';
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
  const { emitter, getPlayerEventKey, getOpponentEventKey } = emitterBundle;
  const isFn = (fn) => typeof fn === 'function';
  const PlacementState = () => {
    const base = BaseState();
    let isOver = false;
    base.isOver = () => isOver;
    base.endTurn = () => {
      emitter.publish(getPlayerEventKey(GAME_EVENTS.PLACEMENTS_FINALIZED));
      isOver = true;
    };

    return {
      call: base.call,
      extend: base.extend,
      add: base.add,
      BASE_METHODS: base.BASE_METHODS
    };
  };

  const CombatState = () => {
    const base = BaseState();
    let coordinator = null;
    let hasStarted = null;
    const COMBAT_METHODS = {
      ...base.BASE_METHODS,
      SEND_ATTACK: 'sendAttack',
      SEND_RESULT: 'sendResult',
      END_STATE: 'endState'
    };
    base.initialize = (incomingAttackHandler, sentAttackResultHandler) => {
      if (hasStarted) return;
      if (!isFn(incomingAttackHandler) || !isFn(sentAttackResultHandler))
        throw new Error('Cannot initialize combat with invalid handlers.');
      coordinator = AttackCoordinator({
        incomingAttackHandler,
        sentAttackResultHandler,
        emitterBundle,
        enableIncomingOn: getOpponentEventKey(GAME_EVENTS.TURN_ENDED),
        disableIncomingOn: getPlayerEventKey(GAME_EVENTS.TURN_ENDED)
      });
      coordinator.start();
      hasStarted = true;
    };
    base.endTurn = () => emitter.publish(getPlayerEventKey(GAME_EVENTS.TURN_ENDED));
    base.add(COMBAT_METHODS.END_STATE, () => {
      coordinator.reset();
      coordinator = null;
      hasStarted = false;
    });
    base.add(COMBAT_METHODS.SEND_ATTACK, (coordinates) => coordinator.sendAttack(coordinates));
    base.add(COMBAT_METHODS.SEND_RESULT, (result) => coordinator.sendResult(result));
    return {
      call: base.call,
      add: base.add,
      extend: base.extend,
      BASE_METHODS: COMBAT_METHODS
    };
  };

  const placement = PlacementState();
  const combat = CombatState();

  return {
    getPlayerEventKey,
    placement,
    combat
  };
};
