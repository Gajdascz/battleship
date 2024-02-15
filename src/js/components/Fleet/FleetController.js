import { StateManager } from '../../utility/stateManagement/StateManager';
import stateManagerRegistry from '../../utility/stateManagement/stateManagerRegistry';
import { StateBundler } from '../../utility/stateManagement/StateBundler';
import { STATES } from '../../utility/constants/common';
import { PLACEMENT_EVENTS } from '../../utility/constants/events';
import { convertToInternalFormat } from '../../utility/utils/coordinatesUtils';

import { bundleComponentStates } from './utility/bundleComponentStates';
import { initializeSateManagement } from '../../utility/stateManagement/initializeStateManagement';
import eventEmitter from '../../utility/eventEmitter';
import { FleetModel } from './model/FleetModel';
import { FleetView } from './view/FleetView';

export const FleetController = () => {
  const model = FleetModel();
  const view = FleetView();
  const _shipControllers = new Map();

  const assignShipToMainFleet = (shipController) => {
    model.addShip(shipController.getModel());
    _shipControllers.set(shipController.getID(), shipController);
  };

  const assignShipToTrackingFleet = (shipModel, shipElement) => {
    view.addTrackingFleetShipElement(shipElement);
    model.addTrackingShip(shipModel);
  };

  const renderMainFleet = () => {
    _shipControllers.forEach((ship) => ship.renderShip(view.getMainFleetShipList()));
  };
  const displayMainFleet = (container) => view.renderMainFleet(container);
  const displayTrackingFleet = (container) => view.renderTrackingFleet(container);

  const handleShipSelected = (detail) => {
    const { id } = detail;
    const button = _shipControllers.get(id).getRotateButtonElement();
    view.updateRotateButton(button);
  };

  eventEmitter.subscribe(PLACEMENT_EVENTS.SHIP.SELECTED, handleShipSelected);
  return {
    renderMainFleet,
    displayMainFleet,
    displayTrackingFleet,
    assignShipToMainFleet,
    assignShipToTrackingFleet,
    getModel: () => model,
    getMainFleetButtonContainer: () => view.getMainFleetButtonContainer(),
    forEach: (callback) => _shipControllers.forEach((ship) => callback(ship)),
    initializeSateManagement: () =>
      initializeSateManagement({ id: model.getID(), stateBundles: [{}] })
  };
};
