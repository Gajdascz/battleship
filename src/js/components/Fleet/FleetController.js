import { convertToInternalFormat } from '../../../utility/utils/coordinatesUtils';
import { dispatch } from './utility/fleetControllerDispatch';

export const FleetController = (fleetModel) => {
  const submitPlacements = () => {
    if (!fleetModel.isPlacementState()) return;
    const placements = new Map();
    fleetModel.getFleet().forEach((ship) => {
      const startCoordinates = convertToInternalFormat(ship.placedCoordinates[0]);
      const endCoordinates = convertToInternalFormat(
        ship.placedCoordinates[ship.placedCoordinates.length - 1]
      );
      placements.set(ship.id, { start: startCoordinates, end: endCoordinates });
    });
    dispatch.submitPlacements(placements);
  };

  const selectShip = (e) => {
    if (!fleetModel.isPlacementState()) return;
    fleetModel.fleet.forEach((ship) => {
      if (ship.id === e.detail.id) ship.select();
      else ship.deselect();
    });
  };

  const assignShipToFleet = (shipController) => {
    fleetModel.addShip(shipController);
  };
  const assignShipToTrackingFleet = (ship) => {
    fleetModel.addTrackingShip(ship);
  };

  const shipSunk = (shipID) => fleetModel.setSunk(shipID);

  return {
    submitPlacements,
    selectShip,
    shipSunk,
    assignShipToFleet,
    assignShipToTrackingFleet
  };
};
