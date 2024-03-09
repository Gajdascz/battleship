// Board Component
import { BoardPlacementManager } from './features/placement/BoardPlacementManager';
import { BoardCombatManager } from './features/combat/BoardCombatManager';
import { BoardView } from './main/view/BoardView';
import { BOARD_COMBAT_EVENTS, BOARD_PLACEMENT_EVENTS } from './common/boardEvents';

export const BoardController = ({
  playerId,
  playerName,
  controllers,
  gameMode,
  displayContainer,
  emitterBundle,
  events
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

  const { emitter, getPlayerEventKey, getOpponentEventKey, EVENTS } = emitterBundle;

  const { placementsFinalized } = events;

  const endTurn = () => emitter.publish(getPlayerEventKey(EVENTS.END_TURN));

  const placement = {
    manager: null,
    onEnd: () => {
      placement.manager = null;
      endTurn();
    },
    initialize: () => {
      placement.manager = BoardPlacementManager({
        placementView: view.placement,
        placementManagers: {
          fleet: fleet.getPlacementManager(),
          mainGrid: mainGrid.getPlacementManager()
        },
        onEnd: placement.onEnd
      });
    },
    start: () => {
      if (!placement.manager) placement.initialize();
      placement.manager.start();
    }
  };

  return {
    getId: () => playerId,
    getPlayerName: () => playerName,
    acceptTrackingFleet: (fleet) => view.acceptTrackingFleet(fleet),
    provideTrackingFleet: () => view.provideTrackingFleet(),
    placement: {
      onEnd: (callback) => placement.onEnd(callback),
      startTurn: () => placement.startTurn(),
      isOver: () => placement.isOver
    },
    view
  };
};
