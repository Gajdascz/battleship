import { BOARD_COMBAT_EVENTS } from '../../common/boardEvents';
export const BoardCombatManager = ({
  combatView,
  combatControllers,
  componentEmitter,
  opponentProcessIncomingAttack,
  opponentOnIncomingAttackProcessed,
  opponentOnAttackSent
}) => {
  const { trackingGrid, mainGrid, fleet } = combatControllers;

  mainGrid.initialize();
  trackingGrid.initialize();
  // fleet.initialize();
  trackingGrid.onAttackSent(opponentProcessIncomingAttack);
  console.log(trackingGrid.onAttackSent);
  console.log(opponentProcessIncomingAttack);
  trackingGrid.onSentAttackProcessed(opponentOnIncomingAttackProcessed);
  const startTurn = () => {
    trackingGrid.enable();
    combatView.startTurn();
  };

  componentEmitter.subscribe(BOARD_COMBAT_EVENTS.START, startTurn);
};
