export const CombatManager = ({ p1CombatData, p2CombatData, eventMethods, lostEvent }) => {
  const { id: p1Id, handlers: p1Handlers, events: p1Events } = p1CombatData;
  const { id: p2Id, handlers: p2Handlers, events: p2Events } = p2CombatData;
  const { on, off, emit } = eventMethods;

  const setupPlayerCombat = (playerEvents, opponentHandlers) => {
    const { SEND_ATTACK, SEND_RESULT, SEND_SHIP_SUNK } = playerEvents;
    const { incomingAttackHandler, incomingResultHandler } = opponentHandlers;
    if (opponentHandlers.shipSunkHandler) on(SEND_SHIP_SUNK, opponentHandlers.shipSunkHandler);
    on(SEND_ATTACK, incomingAttackHandler);
    on(SEND_RESULT, incomingResultHandler);
    return {
      sendAttack: (coordinates) => emit(SEND_ATTACK, coordinates),
      sendResult: (result) => emit(SEND_RESULT, result),
      sendShipSunk: (shipData) => emit(SEND_SHIP_SUNK, shipData),
      sendLost: (loserDetail) => emit(lostEvent, loserDetail)
    };
  };
  const dismantlePlayerCombat = (playerEvents, opponentHandlers) => {
    const { SEND_ATTACK, SEND_RESULT, SEND_SHIP_SUNK } = playerEvents;
    const { incomingAttackHandler, incomingResultHandler } = opponentHandlers;
    if (opponentHandlers.shipSunkHandler) off(SEND_SHIP_SUNK, opponentHandlers.shipSunkHandler);
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
