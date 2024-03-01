import { FleetModel } from './main/model/FleetModel';
import { FleetView } from './main/view/FleetView';
import { EventManager } from '../../Events/management/EventManager';
import { GameStateManager } from '../../State/GameStateManager';
import stateManagerRegistry from '../../State/stateManagerRegistry';
import { FleetPlacementManager } from './features/placement/FleetPlacementManager';

export const FleetController = (scope) => {
  const model = FleetModel(scope);
  const view = FleetView();
  const { publisher, componentEmitter, subscriptionManager } = EventManager(scope);
  const shipControllers = new Map();
  const stateManager = GameStateManager(model.getScopedID());

  const placementManager = FleetPlacementManager({
    shipControllers,
    publisher,
    subscriptionManager
  });

  const assignShipToFleet = (shipController) => {
    const shipModel = shipController.getModel();
    const shipID = shipModel.getScopedID();
    model.addMainShip(shipID, shipModel);
    shipControllers.set(shipID, shipController);
    view.addShipView(shipID, shipController.getView());
    view.populateFleetShipLists();
  };

  stateManager.setFunctions.placement({
    enterFns: placementManager.initialize,
    exitFns: placementManager.end
  });

  return {
    getView: () => view,
    getModel: () => model,
    getTrackingFleet: () => view.getTrackingFleet(),
    assignShipToFleet,
    initializeStateManagement: () => {
      shipControllers.forEach((ship) => ship.initializeStateManagement());
      stateManagerRegistry.registerManager(stateManager);
    },
    isAllShipsSunk: () => model.isAllShipsSunk(),
    isAllShipsPlaced: () => model.isAllShipsPlaced()
  };
};
