/**
 * Sets up combat interactions between players by linking their event handlers to the corresponding
 * events of the opponent. This enables real-time combat event communication such as sending attacks
 * and receiving results. Scoped events ensure that messages are directed appropriately.
 *
 * @param {Object} playerEvents - Scoped events specific to this player for sending attacks and results.
 * @param {Object} opponentHandlers - Callbacks provided by the opponent to respond to received attacks and results.
 * @returns {Object} An interface with methods to initiate combat actions (sendAttack, sendResult, sendLost).
 */
export const CombatManager = ({ p1CombatData, p2CombatData, eventMethods, lostEvent }) => {
  const { id: p1Id, handlers: p1Handlers, combatEvents: p1Events } = p1CombatData;
  const { id: p2Id, handlers: p2Handlers, combatEvents: p2Events } = p2CombatData;
  const { on, off, emit } = eventMethods;

  /**
   * Connects two players through the event system allowing combat event communications.
   * Subscribes the opponents event-handlers to the players scoped events.
   *
   * @param {Object} playerEvents Scoped events for combat communication.
   * @param {Object} opponentHandlers Contains opponent functions to handle events.
   * @returns {Object} Methods to facilitate combat communications.
   */
  const setupPlayerCombat = (playerEvents, opponentHandlers) => {
    const { SEND_ATTACK, SEND_RESULT } = playerEvents;
    const { incomingAttackHandler, incomingResultHandler } = opponentHandlers;
    on(SEND_ATTACK, incomingAttackHandler);
    on(SEND_RESULT, incomingResultHandler);
    return {
      sendAttack: (coordinates) => emit(SEND_ATTACK, coordinates),
      sendResult: (result) => emit(SEND_RESULT, result),
      sendLost: (loserDetail) => emit(lostEvent, loserDetail)
    };
  };
  /**
   * Unsubscribes handlers from scoped combat events.
   */
  const dismantlePlayerCombat = (playerEvents, opponentHandlers) => {
    const { SEND_ATTACK, SEND_RESULT } = playerEvents;
    const { incomingAttackHandler, incomingResultHandler } = opponentHandlers;
    off(SEND_ATTACK, incomingAttackHandler);
    off(SEND_RESULT, incomingResultHandler);
  };

  const reset = () => {
    dismantlePlayerCombat(p1Events, p2Handlers);
    dismantlePlayerCombat(p2Events, p1Handlers);
  };

  return {
    [p1Id]: setupPlayerCombat(p1Events, p2Handlers),
    [p2Id]: setupPlayerCombat(p2Events, p1Handlers),
    reset
  };
};
