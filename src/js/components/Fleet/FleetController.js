import { StateManager } from '../../utility/stateManagement/StateManager';
import stateManagerRegistry from '../../utility/stateManagement/stateManagerRegistry';
import { StateBundler } from '../../utility/stateManagement/StateBundler';
import { STATES } from '../../utility/constants/common';
import { PLACEMENT_EVENTS } from '../../utility/constants/events';
import { convertToInternalFormat } from '../../utility/utils/coordinatesUtils';
import { dispatch } from './utility/fleetControllerDispatch';

export const FleetController = (fleetModel, fleetView) => {
  const _model = fleetModel;
  const _view = fleetView;
  const _stateManager = StateManager(_model.getID());
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

  const selectShip = (e) => {
    const { id } = e;
    _shipControllers.forEach((ship) => {
      if (ship.getID() === id);
      else ship.deselect();
    });
  };

  const assignShipToMainFleet = (shipController) => {
    _view.addMainFleetShipElement(shipController.getElement());
    _model.addShip(shipController.getModel());
    _shipControllers.set(shipController.getID(), shipController);
  };

  const assignShipToTrackingFleet = (shipModel, shipElement) => {
    _view.addTrackingFleetShipElement(shipElement);
    _model.addTrackingShip(shipModel);
  };

  const displayMainFleet = (container) => _view.renderMainFleet(container);
  const displayTrackingFleet = (container) => _view.renderTrackingFleet(container);

  const initializeStateManager = () => {
    const bundler = StateBundler();
    bundler.addSubscriptionToState(STATES.PLACEMENT, {
      event: PLACEMENT_EVENTS.SHIP.SELECTED,
      callback: selectShip
    });
    const bundles = bundler.getBundles();
    bundles.forEach((bundle) => _stateManager.storeState(bundle));
  };

  return {
    displayMainFleet,
    displayTrackingFleet,
    selectShip,
    assignShipToMainFleet,
    assignShipToTrackingFleet,
    getModel: () => _model,
    forEach: (callback) => _model.forEach((ship) => callback(ship)),
    initializeStateManager,
    registerStateManager: () => stateManagerRegistry.registerManager(_stateManager)
  };
};
