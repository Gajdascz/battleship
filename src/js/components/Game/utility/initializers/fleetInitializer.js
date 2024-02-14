import { buildShipComponent } from '../../../../builders/Ship/buildShipComponent';
import { buildFleetComponent } from '../../../../builders/Fleet/buildFleetComponent';

const populateFleet = (fleetController, shipsData) => {
  shipsData.forEach((ship) => {
    const shipController = buildShipComponent(ship);
    shipController.initializeStateManagement();
    fleetController.assignShipToMainFleet(shipController);
  });
};

export const initializeFleet = (fleetShipsData) => {
  const fleetController = buildFleetComponent();
  populateFleet(fleetController, fleetShipsData);
  fleetController.initializeSateManagement();
  return fleetController;
};
