import { BOARD_COMBAT_EVENTS } from '../../common/boardEvents';

export const BoardCombatManager = ({ combatView, combatControllers, emitter }) => {
  const { trackingGrid, mainGrid, fleet } = combatControllers;

  const start = () => {
    mainGrid.start();
    trackingGrid.start();
    fleet.start();
    combatView.setEndTurnFn(endTurn);
  };
  const end = () => {
    mainGrid.end();
    trackingGrid.end();
    fleet.end();
    combatView.endTurn();
  };

  const startTurn = () => {
    trackingGrid.enable();
    combatView.startTurn();
  };

  const handleEndOfTurn = (attackResult) => {
    trackingGrid.disable();
    combatView.endTurn();
    trackingGrid.acceptResult(attackResult);
    emitter.publish(BOARD_COMBAT_EVENTS.SENT_ATTACK_PROCESSED);
  };

  const endTurn = () => emitter.publish(BOARD_COMBAT_EVENTS.TURN_ENDED);

  const attacks = {
    outgoing: {
      acceptResult: (result) => handleEndOfTurn(result),
      enable: () => trackingGrid.enable(),
      disable: () => trackingGrid.disable(),
      onSendAttack: (callback) => trackingGrid.onSendAttack(callback),
      offSendAttack: (callback) => trackingGrid.offSendAttack(callback)
    },
    incoming: {
      process: (coordinates) => mainGrid.processIncomingAttack(coordinates),
      onProcessed: (callback) => mainGrid.onIncomingAttackProcessed(callback),
      offProcessed: (callback) => mainGrid.offIncomingAttackProcessed(callback)
    }
  };

  return {
    start,
    end,
    startTurn,
    endTurn,
    attacks
  };
};
