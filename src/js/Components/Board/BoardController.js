// Board Component
import { BoardPlacementManager } from './features/placement/BoardPlacementManager';
import { BoardCombatManager } from './features/combat/BoardCombatManager';
import { BoardView } from './main/view/BoardView';

export const BoardController = ({
  playerId,
  playerName,
  controllers,
  gameMode,
  displayContainer
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

  const placement = {
    manager: null,
    loadManager: () => {
      if (placement.manager) return;
      placement.manager = BoardPlacementManager({
        placementView: view.placement,
        placementManagers: {
          fleet: fleet.getPlacementManager(),
          mainGrid: mainGrid.getPlacementManager()
        }
      });
    },
    startPlacement: (handleFinalize) => {
      if (!placement.manager) placement.loadManager();
      const onFinalize = () => {
        placement.manager = null;
        handleFinalize();
      };
      placement.manager.startPlacement(onFinalize);
    },
    endPlacement: () => {
      if (!placement.manager) return;
      placement.manager.endPlacement();
      placement.manager = null;
    }
  };

  const combat = {
    manager: null,
    loadManager: () => {
      if (combat.manager) return;
      combat.manager = BoardCombatManager({
        combatView: view.combat,
        gameMode,
        combatManagers: {
          fleet: fleet.getCombatManager(),
          mainGrid: mainGrid.getCombatManager(),
          trackingGrid: trackingGrid.getCombatManager()
        }
      });
    },
    startCombat: ({ sendEndTurn, sendAttack, sendResult, sendShipSunk, sendLost }) => {
      if (!combat.manager) throw new Error(`Board Combat Manager Not initialized`);
      combat.manager.initializeCombat({
        id,
        name,
        sendAttack,
        sendResult,
        sendShipSunk,
        sendLost,
        sendEndTurn
      });
    },
    getHandlers: () => ({
      incomingAttackHandler: combat.manager.incomingAttackHandler,
      incomingResultHandler: combat.manager.incomingResultHandler
    }),
    startTurn: () => combat.manager.startTurn(),
    endCombat: () => {
      if (!combat.manager) return;
      combat.manager.reset();
      combat.manager = null;
    }
  };

  return {
    id,
    name,
    view,
    trackingFleet: view.provideTrackingFleet,
    acceptTrackingFleet: view.acceptTrackingFleet,
    placement: {
      start: placement.startPlacement,
      end: placement.endPlacement
    },
    combat: {
      init: combat.loadManager,
      start: combat.startCombat,
      startTurn: combat.startTurn,
      getHandlers: combat.getHandlers,
      end: () => combat.endCombat
    },
    reset: () => {
      placement.endPlacement();
      combat.endCombat();
    }
  };
};
// const combat = {
//   manager: null,
//   initializeController: () => {
//     if (combat.manager) return;
//     combat.manager = BoardCombatManager({
//       combatView: view.combat,
//       gameMode,
//       combatControllers: {
//         fleet: fleet.getCombatManager(),
//         trackingGrid: trackingGrid.getCombatManager()
//       },
//       processIncomingAttack: mainGrid.processIncomingAttack,
//       combatCoordinator,
//       resetController: combat.resetController
//     });
//     console.log(combat.manager);
//   },
//   resetController: () => (combat.manager = null),
//   getManager: () => {
//     if (!combat.manager) combat.initializeController();
//     return combat.manager;
//   }
// };
