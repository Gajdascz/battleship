// Board Component
import { BoardModel } from './main/model/BoardModel';
import { BoardPlacementManager } from './features/placement/BoardPlacementManager';
import { BoardCombatManager } from './features/combat/BoardCombatManager';
import { BoardView } from './main/view/BoardView';
import { BOARD_PLACEMENT_EVENTS } from './common/boardEvents';
// External
import { EventEmitter } from '../../Events/core/EventEmitter';

export const BoardController = ({
  playerId,
  playerName,
  controllers,
  gameMode,
  displayContainer
}) => {
  const { fleet, mainGrid, trackingGrid } = controllers;
  const componentEmitter = EventEmitter();
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

  return {
    getId: () => playerId(),
    placement: {
      onEnd: (callback) => componentEmitter.subscribe(BOARD_PLACEMENT_EVENTS.END, callback),
      startTurn: () => {
        BoardPlacementManager({
          placementView: view.placement,
          placementControllers: { fleet: fleet.placement, mainGrid: mainGrid.placement },
          componentEmitter
        });
        componentEmitter.publish(BOARD_PLACEMENT_EVENTS.START);
      },
      endTurn: () => componentEmitter.publish(BOARD_PLACEMENT_EVENTS.END)
    },
    combat: {},
    view
  };
};
// const model = BoardModel(playerId, {
//   mainGridModel: controllers.mainGrid.getModel(),
//   trackingGridModel: controllers.trackingGrid.getModel(),
//   fleetModel: controllers.fleet.getModel()
// });
// const { publisher, subscriptionManager, scopeManager } = EventManager(model.getScope());
// const stateManager = GameStateManager(model.getScopedID());

// const placementManager = BoardPlacementManager({ view, model, publisher, subscriptionManager });
// const combatManager = BoardCombatManager({ view, publisher, subscriptionManager, scopeManager });

// const initializePlacement = () => {
//   current.state = STATES.PLACEMENT;
//   //   placementManager.initialize();
// };
// const initializeCombat = () => {
//   current.state = STATES.PROGRESS;
//   combatManager.initialize(gameMode, model.getOpponentScope());
// };

// stateManager.setFunctions.placement({ enterFns: initializePlacement });
// stateManager.setFunctions.progress({
//   enterFns: initializeCombat,
//   exitFns: combatManager.end
// });
