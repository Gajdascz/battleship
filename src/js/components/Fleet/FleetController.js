import { StateManager } from '../../utility/stateManagement/StateManager';
import stateManagerRegistry from '../../utility/stateManagement/stateManagerRegistry';
import { StateBundler } from '../../utility/stateManagement/StateBundler';
import { STATES } from '../../utility/constants/common';
import { PLACEMENT_EVENTS } from '../../utility/constants/events';
import { convertToInternalFormat } from '../../utility/utils/coordinatesUtils';

import { bundleComponentStates } from './utility/bundleComponentStates';
import { initializeSateManagement } from '../../utility/stateManagement/initializeStateManagement';
import eventEmitter from '../../utility/eventEmitter';

export const FleetController = (fleetModel, fleetView) => {
  const _model = fleetModel;
  const _view = fleetView;
  const _shipControllers = new Map();

  // const handlePlacementSubmission = () => {
  //   const placements = new Map();
  //   _model.getFleet().forEach((ship) => {
  //     const startCoordinates = convertToInternalFormat(ship.placedCoordinates[0]);
  //     const endCoordinates = convertToInternalFormat(
  //       ship.placedCoordinates[ship.placedCoordinates.length - 1]
  //     );
  //     placements.set(ship.id, { start: startCoordinates, end: endCoordinates });
  //   });
  //   dispatch.submitPlacements(placements);
  // };

  const assignShipToMainFleet = (shipController) => {
    _model.addShip(shipController.getModel());
    _shipControllers.set(shipController.getID(), shipController);
  };

  const assignShipToTrackingFleet = (shipModel, shipElement) => {
    _view.addTrackingFleetShipElement(shipElement);
    _model.addTrackingShip(shipModel);
  };

  const renderMainFleet = () => {
    _shipControllers.forEach((ship) => ship.renderShip(_view.getMainFleetShipList()));
  };
  const displayMainFleet = (container) => _view.renderMainFleet(container);
  const displayTrackingFleet = (container) => _view.renderTrackingFleet(container);

  const handleShipSelected = (detail) => {
    const { id } = detail;
    const button = _shipControllers.get(id).getRotateButtonElement();
    _view.updateRotateButton(button);
  };

  eventEmitter.subscribe(PLACEMENT_EVENTS.SHIP.SELECTED, handleShipSelected);
  return {
    renderMainFleet,
    displayMainFleet,
    displayTrackingFleet,
    assignShipToMainFleet,
    assignShipToTrackingFleet,
    getModel: () => _model,
    getMainFleetButtonContainer: () => _view.getMainFleetButtonContainer(),
    forEach: (callback) => _shipControllers.forEach((ship) => callback(ship)),
    initializeSateManagement: () =>
      initializeSateManagement({ id: _model.getID(), stateBundles: [{}] })
  };
};
