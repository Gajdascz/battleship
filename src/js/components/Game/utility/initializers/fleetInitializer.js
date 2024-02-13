import { buildShipComponent } from '../../../../builders/Ship/buildShipComponent';
import { buildFleetComponent } from '../../../../builders/Fleet/buildFleetComponent';

const populateFleet = (fleetController, shipsData) => {
  shipsData.forEach((ship) => {
    const shipController = buildShipComponent(ship);
    const shipModel = shipController.getModel();
    const shipElement = shipController.getElement();
    shipController.initializeStateManager();
    shipController.registerStateManager();
    fleetController.assignShipToMainFleet(shipModel, shipElement);
  });
};

export const initializeFleet = (fleetShipsData) => {
  const fleet = buildFleetComponent();
  populateFleet(fleet, fleetShipsData);
  return fleet;
};
