import { ORIENTATIONS, STATUSES } from '../../../../Utility/constants/common';
export const ShipModel = ({ shipLength, shipName }) => {
  const length = shipLength;
  const placedCoordinates = [];
  const name = shipName;
  const id = shipName.toLowerCase().replace(/' '/g, '-');
  let isPlaced = false;
  let isSelected = false;
  let health = length;
  let orientation = ORIENTATIONS.VERTICAL;

  return {
    isShip: () => true,
    isSunk: () => health <= 0,
    isSelected: () => isSelected,
    isPlaced: () => isPlaced,
    getId: () => id,
    getLength: () => length,
    getName: () => name,
    getHealth: () => health,
    getOrientation: () => orientation,
    getPlacedCoordinates: () => placedCoordinates.map((coordinates) => [...coordinates]),
    setIsPlaced: (value) => (isPlaced = value),
    setIsSelected: (value) => (isSelected = value),
    setPlacedCoordinates: (coordinates) => {
      placedCoordinates.length = 0;
      placedCoordinates.push(...coordinates);
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
      isSelected = false;
    }
  };
};
