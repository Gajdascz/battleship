// Board Component
import { BoardPlacementManager } from './features/placement/BoardPlacementManager';
import { BoardCombatManager } from './features/combat/BoardCombatManager';
import { BoardView } from './main/view/BoardView';

export const BoardController = ({
  playerId,
  playerName,
  controllers,
  gameMode,
  displayContainer,
  gameCoordinator
}) => {
  const { fleet, mainGrid, trackingGrid } = controllers;
  const id = playerId;
  const name = playerName;
  const viewParameters = {
    playerId,
    playerName,
    container: displayContainer,
    gameMode,
    views: {
      mainGrid: mainGrid.view,
      trackingGrid: trackingGrid.view,
      fleet: fleet.view
    }
  };
  const view = BoardView(viewParameters);
  const {
    placement: placementCoordinator,
    combat: combatCoordinator,
    subscribeEndTurn,
    unsubscribeEndTurn
  } = gameCoordinator;

  const placement = {
    manager: null,
    initializeController: () => {
      if (placement.manager) return;
      placement.manager = BoardPlacementManager({
        placementView: view.placement,
        placementManagers: {
          fleet: fleet.getPlacementManager(),
          mainGrid: mainGrid.getPlacementManager()
        },
        placementCoordinator,
        resetController: placement.resetController
      });
    },
    resetController: () => (placement.manager = null),
    getManager: () => {
      if (!placement.manager) placement.initializeController();
      return placement.manager;
    }
  };

  const combat = {
    manager: null,
    initializeController: () => {
      if (combat.manager) return;
      combat.manager = BoardCombatManager({
        combatView: view.combat,
        gameMode,
        combatControllers: {
          fleet: fleet.getCombatManager(),
          trackingGrid: trackingGrid.getCombatManager()
        },
        processIncomingAttack: mainGrid.processIncomingAttack,
        combatCoordinator,
        resetController: combat.resetController
      });
      console.log(combat.manager);
    },
    resetController: () => (combat.manager = null),
    getManager: () => {
      if (!combat.manager) combat.initializeController();
      return combat.manager;
    }
  };

  return {
    id,
    name,
    trackingFleet: view.provideTrackingFleet,
    acceptTrackingFleet: view.acceptTrackingFleet,
    getPlacementManager: placement.getManager,
    getCombatManager: combat.getManager,
    subscribeEndTurn,
    unsubscribeEndTurn,
    view
  };
};
