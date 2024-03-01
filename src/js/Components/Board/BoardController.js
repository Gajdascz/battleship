// Board Component
import { BoardModel } from './main/model/BoardModel';
import { HvHBoardView } from './main/view/HvHBoardView';
import { HvABoardView } from './main/view/HvABoardView';
import { BoardPlacementManager } from './features/placement/BoardPlacementManager';
import { BoardCombatManager } from './features/combat/BoardCombatManager';

// External
import { EventManager } from '../../Events/management/EventManager';
import { GameStateManager } from '../../State/GameStateManager';
import { GAME_MODES } from '../../Utility/constants/common';
import stateManagerRegistry from '../../State/stateManagerRegistry';

export const BoardController = ({
  playerID,
  playerName,
  fleetController,
  mainGridController,
  trackingGridController,
  gameMode
}) => {
  const controllers = {
    fleet: fleetController,
    mainGrid: mainGridController,
    trackingGrid: trackingGridController
  };
  const model = BoardModel(playerID, {
    mainGridModel: controllers.mainGrid.getModel(),
    trackingGridModel: controllers.trackingGrid.getModel(),
    fleetModel: controllers.fleet.getModel()
  });
  const viewParameters = {
    scopedID: model.getScopedID(),
    playerName,
    mainGridView: controllers.mainGrid.getView(),
    trackingGridView: controllers.trackingGrid.getView(),
    fleetView: controllers.fleet.getView()
  };

  const view =
    gameMode === GAME_MODES.HvH ? HvHBoardView(viewParameters) : HvABoardView(viewParameters);

  const { publisher, subscriptionManager, componentEmitter } = EventManager(model.getScope());
  const stateManager = GameStateManager(model.getScopedID());

  const placementManager = BoardPlacementManager({ view, model, publisher, subscriptionManager });
  const combatManager = BoardCombatManager({ view, publisher, subscriptionManager });

  const initializeCombat = () => combatManager.initialize(gameMode);

  stateManager.setFunctions.placement({ enterFns: placementManager.initialize });
  stateManager.setFunctions.progress({
    enterFns: initializeCombat,
    exitFns: combatManager.end
  });

  return {
    set: {
      displayContainer: (container) => view.setContainer(container),
      trackingFleet: (fleet) => view.trackingGrid.setFleet(fleet)
    },
    isAllShipsPlaced: () => model.isAllShipsPlaced(),
    getView: () => view,
    initializeStateManagement: () => stateManagerRegistry.registerManager(stateManager),
    view
  };
};
