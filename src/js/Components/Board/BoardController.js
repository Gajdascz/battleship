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
    getPlayerEventKey
  } = gameCoordinator;

  const placementManager = {
    manager: null,
    isInitialized: false,
    initialize: () => {
      if (placementManager.isInitialized) return;
      placementManager.manager = BoardPlacementManager({
        placementView: view.placement,
        placementManagers: {
          fleet: fleet.getPlacementManager(),
          mainGrid: mainGrid.getPlacementManager()
        },
        placementCoordinator
      });
      placementManager.manager.initialize();
      placementManager.isInitialized = true;
    },
    startTurn: () => placementManager.manager.startTurn(),
    endTurn: () => {
      if (!placementManager.isInitialized) return;
      placementManager.manager.endTurn();
      placementManager.isInitialized = false;
      placementManager.manager = null;
    },
    isOver: () => placementManager.manager.isOver()
  };

  return {
    getId: () => playerId,
    getPlayerName: () => playerName,
    acceptTrackingFleet: (fleet) => view.acceptTrackingFleet(fleet),
    provideTrackingFleet: () => view.provideTrackingFleet(),
    getPlayerEventKey,
    placementManager,
    view
  };
};
