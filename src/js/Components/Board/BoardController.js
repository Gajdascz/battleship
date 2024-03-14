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
    }
  };

  const combat = {
    manager: null,
    loadManager: (sendEndTurn) => {
      if (combat.manager) return;
      combat.manager = BoardCombatManager({
        combatView: view.combat,
        combatManagers: {
          fleet: fleet.getCombatManager(),
          mainGrid: mainGrid.getCombatManager()
        },
        sendEndTurn
      });
    },
    initializeCombat: ({ sendEndTurn, sendAttack, sendResult, sendLost }) => {
      if (!combat.manager) combat.loadManager(sendEndTurn);
      combat.manager.startCombat({ id, name, sendAttack, sendResult, sendLost });
    },
    endCombat: () => {
      if (!combat.manager) return;
      combat.manager.endCombat();
    }
  };

  return {
    id,
    name,
    trackingFleet: view.provideTrackingFleet,
    acceptTrackingFleet: view.acceptTrackingFleet,
    placement: {
      start: placement.startPlacement,
      end: placement.endPlacement
    },
    combat: {
      init: (initData) => combat.initializeCombat(initData)
    },
    view
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
