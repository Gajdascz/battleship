import { generateComponentID } from '../../../utility/utils/stringUtils';

export const FleetModel = (fleetScope) => {
  const id = generateComponentID({ scope: fleetScope, name: `fleet` });
  const scope = fleetScope;
  const mainFleet = new Map();
  const trackingFleet = new Map();

  return {
    isAllShipsPlaced: () => [...mainFleet.values()].every((ship) => ship.isPlaced()),
    isAllShipSunk: () => [...mainFleet.values()].every((ship) => ship.isSunk()),
    addMainShip: (shipID, shipModel) => mainFleet.set(shipID, shipModel),
    addTrackingShip: (ship) => trackingFleet.set(ship.id, ship),
    getFleet: () => [...mainFleet.values()],
    getTrackingFleet: () => [...trackingFleet.values()],
    getShipFromMainFleet: (shipID) => mainFleet.get(shipID),
    getID: () => id,
    getScope: () => scope
  };
};
