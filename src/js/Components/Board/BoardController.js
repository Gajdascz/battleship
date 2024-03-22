import { BoardPlacementManager } from './Managers/BoardPlacementManager';
import { BoardCombatManager } from './Managers/BoardCombatManager';
import { BoardView } from './main/view/BoardView';

/**
 * Orchestrates player component controllers into a cohesive board.
 *
 * @param {Object} config Configuration for board controller including player information, controllers for game elements, and display container.
 * @param {string} config.playerId Unique identifier for the player.
 * @param {string} config.playerName Name of the player.
 * @param {Object} config.controllers Controllers for fleet, mainGrid, and trackingGrid.
 * @param {string} config.gameMode Current game mode.
 * @param {HTMLElement} config.displayContainer Container for game display.
 * @returns {Object} An interface to manage board view, placement, and combat, including initialization and reset functionalities.
 */
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
    displayContainer,
    gameMode,
    views: {
      mainGrid: mainGrid.view,
      trackingGrid: trackingGrid.view,
      fleet: fleet.view
    }
  };
  const view = BoardView(viewParameters);

  /**
   * Encapsulates the initialization and management of the board's placement functionality.
   */
  const placement = {
    manager: null,
    loadManager: () => {
      if (placement.manager) return;
      placement.manager = BoardPlacementManager({
        placementView: view.placementView,
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
  /**
   * Encapsulates the initialization and management of the board's combat functionality.
   */
  const combat = {
    manager: null,
    loadManager: () => {
      if (combat.manager) return;
      combat.manager = BoardCombatManager({
        combatView: view.combatView,
        playerId,
        combatManagers: {
          fleet: fleet.getCombatManager(),
          mainGrid: mainGrid.getCombatManager(),
          trackingGrid: trackingGrid.getCombatManager()
        }
      });
    },
    startCombat: ({ sendAttack, sendResult, sendLost, endTurnMethod }) => {
      if (!combat.manager) throw new Error(`Board Combat Manager Not initialized`);
      combat.manager.initializeCombat({
        sendAttack,
        sendResult,
        sendLost,
        endTurnMethod
      });
    },
    /**
     * Provides callback functions to handle combat interactions.
     */
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
    provideTrackingFleet: view.provideTrackingFleet,
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
      view.reset();
    }
  };
};
