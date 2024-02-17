import { ORIENTATIONS, STATUSES } from '../../../utility/constants/common';
import { createIdentity } from '../../../utility/utils/createIdentity';

export const ShipModel = (shipScope, { shipLength, shipName }) => {
  const { scope, id, scopedID, name } = createIdentity({
    scope: shipScope,
    name: shipName
  });

  const length = shipLength;
  const placedCoordinates = [];
  let isPlaced = false;
  let isSelected = false;
  let health = length;
  let orientation = ORIENTATIONS.VERTICAL;

  return {
    isShip: () => true,
    isSunk: () => health <= 0,
    isSelected: () => isSelected,
    isPlaced: () => isPlaced,
    getID: () => id,
    getScope: () => scope,
    getScopedID: () => scopedID,
    getLength: () => length,
    getName: () => name,
    getHealth: () => health,
    getOrientation: () => orientation,
    getPlacedCoordinates: () => placedCoordinates.map((coordinates) => coordinates.slice()),
    setIsPlaced: (value) => (isPlaced = value),
    setIsSelected: (value) => (isSelected = value),
    setPlacedCoordinates: (coordinates) => {
      placedCoordinates.length = 0;
      placedCoordinates.push(...coordinates);
      console.log(placedCoordinates);
    },
    clearPlacedCoordinates: () => (placedCoordinates.length = 0),
    toggleOrientation: () =>
      (orientation =
        orientation === ORIENTATIONS.VERTICAL ? ORIENTATIONS.HORIZONTAL : ORIENTATIONS.VERTICAL),
    hit: () => {
      if (health > 0) health--;
      return health > 0 ? STATUSES.HIT : STATUSES.SHIP_SUNK;
    },
    reset: () => {
      placedCoordinates.length = 0;
      health = length;
      shipName = shipScope;
      isSelected = false;
    }
  };
};
