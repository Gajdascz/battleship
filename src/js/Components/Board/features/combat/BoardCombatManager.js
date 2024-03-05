export const BoardCombatManager = (view, combatControllers, componentEmitter) => {
  const { trackingGrid, mainGrid, fleet } = combatControllers;
  const handleInitialize = (opponentProcessIncomingAttack) => {
    opponentProcessIncomingAttack(trackingGrid.onAttackSent);
    trackingGrid.onAttackProcessed(mainGrid.onAttackProcessed);
  };

  const startTurn = () => {};
};
