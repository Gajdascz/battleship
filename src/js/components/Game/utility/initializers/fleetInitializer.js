import { buildShipComponent } from '../../../../builders/Ship/buildShipComponent';
import { buildFleetComponent } from '../../../../builders/Fleet/buildFleetComponent';

const populateFleet = (fleetController, shipsData) => {
  shipsData.forEach((ship) => {
    console.log(ship);
    const shipController = buildShipComponent(ship);
    fleetController.assignShipToMainFleet(shipController);
  });
};

export const initializeFleet = (fleetShipsData) => {
  const fleet = buildFleetComponent();
  populateFleet(fleet, fleetShipsData);
  fleet.initializeStateManager();
  fleet.registerStateManager();
  return fleet;
};
