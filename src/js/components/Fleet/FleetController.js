import { convertToInternalFormat } from '../../utility/utils/coordinatesUtils';
import { dispatch } from './utility/fleetControllerDispatch';

export const FleetController = (fleetModel, fleetView) => {
  const _model = fleetModel;
  const _view = fleetView;

  const handlePlacementSubmission = () => {
    if (!_model.isPlacementState()) return;
    const placements = new Map();
    _model.getFleet().forEach((ship) => {
      const startCoordinates = convertToInternalFormat(ship.placedCoordinates[0]);
      const endCoordinates = convertToInternalFormat(
        ship.placedCoordinates[ship.placedCoordinates.length - 1]
      );
      placements.set(ship.id, { start: startCoordinates, end: endCoordinates });
    });
    dispatch.submitPlacements(placements);
  };

  const selectShip = (e) => {
    if (!_model.isPlacementState()) return;
    _model.fleet.forEach((ship) => {
      if (ship.id === e.detail.id) ship.select();
      else ship.deselect();
    });
  };

  const assignShipToMainFleet = (shipModel, shipElement) => {
    _view.addMainFleetShipElement(shipElement);
    _model.addShip(shipModel);
  };

  const assignShipToTrackingFleet = (shipModel, shipElement) => {
    _view.addTrackingFleetShipElement(shipElement);
    _model.addTrackingShip(shipModel);
  };

  const shipSunk = (shipID) => fleetModel.setSunk(shipID);

  const displayMainFleet = (container) => _view.renderMainFleet(container);
  const displayTrackingFleet = (container) => _view.renderTrackingFleet(container);

  return {
    displayMainFleet,
    displayTrackingFleet,
    selectShip,
    shipSunk,
    assignShipToMainFleet,
    assignShipToTrackingFleet
  };
};
