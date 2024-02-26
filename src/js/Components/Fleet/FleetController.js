import { FleetModel } from './model/FleetModel';
import { FleetView } from './view/FleetView';
import { PLACEMENT_EVENTS } from '../../Events/eventConstants';
import { StateCoordinator } from '../../State/StateCoordinator';
import { PUBLISHER_KEYS, buildPublisher } from './utility/buildPublisher';

export const FleetController = (scope) => {
  const model = FleetModel(scope);
  const view = FleetView();
  const stateCoordinator = StateCoordinator(model.getScopedID(), model.getScope());
  const publisher = buildPublisher(scope);
  const shipControllers = new Map();
  const shipDataTracker = { readyForPlacement: 0 };

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

  const handleShipReadyForPlacement = () => {
    shipDataTracker.readyForPlacement += 1;
    if (shipDataTracker.readyForPlacement === shipControllers.size)
      publisher.execute(PUBLISHER_KEYS.ACTIONS.PLACEMENT_CONTAINER_FULFILLED);
  };

  return {
    getView: () => view,
    getModel: () => model,
    getTrackingFleet: () => view.elements.trackingFleet,
    assignShipToFleet,
    forEach: (callback) => shipControllers.forEach((ship) => callback(ship)),
    initializeStateManagement: () => {
      stateCoordinator.placement.addSubscribe(
        PLACEMENT_EVENTS.SHIP_READY_FOR_PLACEMENT,
        handleShipReadyForPlacement
      );
      stateCoordinator.placement.addExecute(initializeShipsStateManagement);
      stateCoordinator.placement.addSubscribe(
        PLACEMENT_EVENTS.SHIP_SELECTION_REQUESTED,
        handleShipSelectionRequest
      );
      stateCoordinator.initializeManager();
    }
  };
};
