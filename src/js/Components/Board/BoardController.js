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
  const { placement: placementCoordinator, combat: combatCoordinator } = gameCoordinator;

  const placement = {
    manager: null,
    initialize: () => {
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
      placement.manager.initialize();
    },
    resetController: () => (placement.manager = null),
    getManager: () => {
      if (!placement.manager) placement.initialize();
      return placement.manager;
    }
  };

  return {
    id,
    name,
    trackingFleet: view.provideTrackingFleet,
    acceptTrackingFleet: view.acceptTrackingFleet,
    getPlacementManager: placement.getManager,
    view
  };
};
