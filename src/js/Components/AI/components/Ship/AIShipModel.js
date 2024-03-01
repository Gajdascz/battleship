import { STATUSES } from '../../common/constants';
import { createSlug } from '../../common/utilityFunctions';

export const AIShipModel = (shipLength, shipName) => {
  const length = shipLength;
  const id = createSlug(shipName);
  const name = shipName;
  const placedCoordinates = [];
  let health = length;

  return {
    isShip: () => true,
    isSunk: () => health <= 0,
    isPlaced: () => placedCoordinates.length === length,
    getID: () => id,
    getLength: () => length,
    getName: () => name,
    getHealth: () => health,
    setPlacedCoordinates: (coordinates) => {
      placedCoordinates.length = 0;
      placedCoordinates.push(...coordinates);
    },
    hit: () => {
      if (health > 0) health--;
      return health > 0 ? STATUSES.HIT : STATUSES.SHIP_SUNK;
    },
    reset: () => {
      placedCoordinates.length = 0;
      health = length;
    }
  };
};
