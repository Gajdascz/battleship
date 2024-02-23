import { createIdentity } from '../../../utility/utils/createIdentity';
export const FleetModel = (fleetScope) => {
  const { scope, id, scopedID, name } = createIdentity({
    scope: fleetScope,
    name: 'Fleet'
  });

  const mainFleet = new Map();
  const trackingFleet = new Map();

  return {
    getID: () => id,
    getName: () => name,
    getScope: () => scope,
    getScopedID: () => scopedID,
    isAllShipsPlaced: () => [...mainFleet.values()].every((ship) => ship.isPlaced()),
    isAllShipsSunk: () => [...mainFleet.values()].every((ship) => ship.isSunk()),
    addMainShip: (shipID, shipModel) => mainFleet.set(shipID, shipModel),
    addTrackingShip: (ship) => trackingFleet.set(ship.id, ship),
    getFleet: () => [...mainFleet.values()],
    getTrackingFleet: () => [...trackingFleet.values()],
    getShipFromMainFleet: (shipID) => mainFleet.get(shipID),
    getFleetPlacements: () => {
      const placements = new Map();
      [...mainFleet.values()].forEach((ship) => {
        placements.set(ship.getScopedID(), ship.getPlacedCoordinates());
      });
      return placements;
    }
  };
};
