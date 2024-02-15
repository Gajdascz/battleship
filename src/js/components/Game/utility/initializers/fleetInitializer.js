import { buildFleetComponent } from '../../../Fleet/buildFleetComponent';
import { ShipController } from '../../../Ship/ShipController';
const populateFleet = (fleetController, shipsData) => {
  shipsData.forEach((ship) => {
    console.log(ship);
    const shipController = ShipController(ship);
    shipController.initializeStateManagement();
    fleetController.assignShipToMainFleet(shipController);
  });
};

export const initializeFleet = (fleetShipsData) => {
  const fleetController = buildFleetComponent();
  populateFleet(fleetController, fleetShipsData);
  fleetController.initializeSateManagement();
  fleetController.renderMainFleet();
  return fleetController;
};
