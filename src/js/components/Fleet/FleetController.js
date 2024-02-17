import { initializeStateCoordinator } from './utility/initializeStateCoordinator';
import { FleetModel } from './model/FleetModel';
import { FleetView } from './view/FleetView';

export const FleetController = (scope) => {
  const model = FleetModel(scope);
  const view = FleetView();
  const shipControllers = new Map();

  const assignShipToFleet = (shipController) => {
    const shipModel = shipController.getModel();
    const shipID = shipModel.getID();
    model.addMainShip(shipID, shipModel);
    shipControllers.set(shipID, shipController);
    view.addShipView(shipID, shipController.getView());
    view.populateFleetShipLists();
  };

  const handleShipSelectionRequest = ({ data }) => {
    const { id, rotateButton } = data;
    shipControllers.forEach((controller) => {
      if (controller.getID() === id) controller.select();
      else if (controller.isSelected()) controller.deselect();
    });
    view.updateRotateShipButton(id, rotateButton);
  };

  const initializeShipStates = () => {
    shipControllers.forEach((controller) => {
      controller.initializeStateManagement();
    });
  };
  return {
    getView: () => view,
    getModel: () => model,
    getTrackingFleet: () => view.elements.trackingFleet,
    assignShipToFleet,
    setShipPlacementContainer: (container) => view.setShipPlacementContainer(container),
    forEach: (callback) => shipControllers.forEach((ship) => callback(ship)),
    initializeStateManagement: () => {
      initializeStateCoordinator(model.getID(), model.getScope(), {
        handleShipSelectionRequest,
        initializeShipStates
      });
    }
  };
};
