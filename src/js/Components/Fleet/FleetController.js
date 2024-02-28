import { FleetModel } from './model/FleetModel';
import { FleetView } from './view/FleetView';
import { SHIP_EVENTS } from '../Ship/events/shipEvents';
import { EventManager } from '../../Events/management/EventManager';
import { MAIN_GRID_EVENTS } from '../Grids/MainGrid/utility/mainGridEvents';
import { GameStateManager } from '../../State/GameStateManager';
import stateManagerRegistry from '../../State/stateManagerRegistry';
export const FleetController = (scope) => {
  const model = FleetModel(scope);
  const view = FleetView();
  const { publisher, componentEmitter, subscriptionManager } = EventManager(scope);
  const shipControllers = new Map();
  const shipDataTracker = { containersReceived: 0 };
  const stateManager = GameStateManager(model.getScopedID());

  const assignShipToFleet = (shipController) => {
    const shipModel = shipController.getModel();
    const shipID = shipModel.getScopedID();
    model.addMainShip(shipID, shipModel);
    shipControllers.set(shipID, shipController);
    view.addShipView(shipID, shipController.getView());
    view.populateFleetShipLists();
  };

  const handlers = {
    shipSelectRequested: ({ data }) => {
      console;
      const { scopedID } = data;
      shipControllers.forEach((controller) => {
        if (controller.properties.getScopedID() === scopedID) controller.placement.select();
        else if (controller.properties.isSelected()) controller.placement.deselect();
      });
    },
    containerReceived: () => {
      shipDataTracker.containersReceived += 1;
      if (shipDataTracker.containersReceived === shipControllers.size) {
        publisher.scoped.fulfill(MAIN_GRID_EVENTS.PLACEMENT.GRID_INITIALIZED);
      }
    }
  };

  const selectionAndPlacementManager = {
    subscriptions: [
      {
        event: SHIP_EVENTS.PLACEMENT.CONTAINER_RECEIVED,
        callback: handlers.containerReceived
      },
      {
        event: SHIP_EVENTS.SELECTION.SELECTION_REQUESTED,
        callback: handlers.shipSelectRequested
      }
    ],
    subscribe: () =>
      subscriptionManager.scoped.subscribeMany(selectionAndPlacementManager.subscriptions),
    unsubscribe: () =>
      subscriptionManager.all.unsubscribe(selectionAndPlacementManager.subscriptions),

    initialize: () => {
      subscriptionManager.scoped.subscribeMany(selectionAndPlacementManager.subscriptions);
    },
    end: () => {
      selectionAndPlacementManager.unsubscribe();
    }
  };

  stateManager.setFunctions.placement(
    selectionAndPlacementManager.initialize,
    selectionAndPlacementManager.end
  );

  return {
    getView: () => view,
    getModel: () => model,
    getTrackingFleet: () => view.elements.trackingFleet,
    assignShipToFleet,
    forEach: (callback) => shipControllers.forEach((ship) => callback(ship)),
    initializeStateManagement: () => {
      shipControllers.forEach((ship) => ship.initializeStateManagement());
      stateManagerRegistry.registerManager(stateManager);
    }
  };
};
