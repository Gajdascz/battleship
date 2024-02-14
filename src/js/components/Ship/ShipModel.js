import { createSlug } from '../../utility/utils/stringUtils';
import { ORIENTATIONS, STATUSES } from '../../utility/constants/common';

export const ShipModel = ({ length, name }) => {
  const _length = length;
  const _id = createSlug(name);
  const _name = name;
  const _placedCoordinates = [];
  let _isPlaced = false;
  let _isSelected = false;
  let _health = length;
  let _orientation = ORIENTATIONS.VERTICAL;

  return {
    isShip: () => true,
    isSunk: () => _health <= 0,
    isSelected: () => _isSelected,
    isPlaced: () => _isPlaced,
    getID: () => _id,
    getLength: () => _length,
    getName: () => _name,
    getHealth: () => _health,
    getOrientation: () => _orientation,
    getPlacedCoordinates: () => _placedCoordinates.map((coordinates) => coordinates.slice()),
    setIsPlaced: (value) => (_isPlaced = value),
    setIsSelected: (value) => (_isSelected = value),
    setPlacedCoordinates: (coordinates) => {
      _placedCoordinates.length = 0;
      _placedCoordinates.push(...coordinates);
      console.log(_placedCoordinates);
    },
    clearPlacedCoordinates: () => (_placedCoordinates.length = 0),
    toggleOrientation: () =>
      (_orientation =
        _orientation === ORIENTATIONS.VERTICAL ? ORIENTATIONS.HORIZONTAL : ORIENTATIONS.VERTICAL),
    hit: () => {
      if (_health > 0) _health--;
      return _health > 0 ? STATUSES.HIT : STATUSES.SHIP_SUNK;
    },
    reset: () => {
      _placedCoordinates.length = 0;
      _health = _length;
      _isPlaced = false;
      _isSelected = false;
    }
  };
};
