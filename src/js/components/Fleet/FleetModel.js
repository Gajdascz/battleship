import { generateRandomID } from '../../utility/utils/stringUtils';

export const FleetModel = (id = null) => {
  const _id = id ?? generateRandomID();
  const _fleet = new Map();
  const _trackingFleet = new Map();

  return {
    isAllShipsPlaced: () => [..._fleet.values()].every((ship) => ship.isPlaced()),
    addShip: (ship) => _fleet.set(ship.id, ship),
    addTrackingShip: (ship) => _trackingFleet.set(ship.id, ship),
    setTrackingSunk: (shipID) => _trackingFleet.get(shipID).setSunk(),
    getFleet: () => [..._fleet.values()],
    getTrackingFleet: () => [..._trackingFleet.values()],
    getID: () => _id
  };
};
