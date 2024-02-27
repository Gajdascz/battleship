import { FleetModel } from './model/FleetModel';
import { FleetView } from './view/FleetView';
import { PLACEMENT_EVENTS } from '../../Events/eventConstants';
import { StateCoordinator } from '../../State/StateCoordinator';
import { SHIP_EVENTS } from '../Ship/events/shipEvents';
import { EventManager } from '../../Events/management/EventManager';
import { MAIN_GRID_EVENTS } from '../Grids/MainGrid/utility/mainGridEvents';

export const FleetController = (scope) => {
  const model = FleetModel(scope);
  const view = FleetView();
  const { publisher, componentEmitter, subscriptionManager } = EventManager(scope);
  const stateCoordinator = StateCoordinator(model.getScopedID(), model.getScope());
  const shipControllers = new Map();
  const shipDataTracker = { containersReceived: 0 };

  const assignShipToFleet = (shipController) => {
    const shipModel = shipController.getModel();
    const shipID = shipModel.getScopedID();
    model.addMainShip(shipID, shipModel);
    shipControllers.set(shipID, shipController);
    view.addShipView(shipID, shipController.getView());
    view.populateFleetShipLists();
  };

  const handleShipSelectionRequest = ({ data }) => {
    const { scopedID } = data;
    shipControllers.forEach((controller) => {
      if (controller.getScopedID() === scopedID) controller.select();
      else if (controller.isSelected()) controller.deselect();
    });
  };

  const initializeShipsStateManagement = () =>
    shipControllers.forEach((ship) => ship.initializeStateManagement());

  const handleContainerReceived = () => {
    shipDataTracker.containersReceived += 1;
    if (shipDataTracker.containersReceived === shipControllers.size) {
      publisher.scoped.fulfill(MAIN_GRID_EVENTS.PLACEMENT.GRID_INITIALIZED);
    }
  };

  subscriptionManager.normal.scoped.subscribe(
    SHIP_EVENTS.PLACEMENT.CONTAINER_RECEIVED,
    handleContainerReceived
  );

  return {
    getView: () => view,
    getModel: () => model,
    getTrackingFleet: () => view.elements.trackingFleet,
    assignShipToFleet,
    forEach: (callback) => shipControllers.forEach((ship) => callback(ship)),
    initializeStateManagement: () => {
      stateCoordinator.placement.addExecute(initializeShipsStateManagement);
      stateCoordinator.placement.addSubscribe(
        SHIP_EVENTS.SELECTION.SELECTION_REQUESTED,
        handleShipSelectionRequest
      );
      stateCoordinator.initializeManager();
    }
  };
};
