import { createSlug } from '../../utility/utils/stringUtils';
import { STATES, ORIENTATIONS } from '../../utility/constants/common';

export const ShipModel = ({ length, name }) => {
  const _length = length;
  const _id = createSlug(name);
  const _name = name;
  const _placedCoordinates = [];
  let _isPlaced = false;
  let _isSelected = false;
  let _health = length;
  let _orientation = ORIENTATIONS.VERTICAL;
  let _state = STATES.PLACEMENT;

  return {
    isShip: () => true,
    isSunk: () => _health <= 0,
    isSelected: () => _isSelected,
    isPlaced: () => _isPlaced,
    isVertical: () => _orientation === ORIENTATIONS.VERTICAL,
    isPlacementState: () => _state === STATES.PLACEMENT,
    isProgressState: () => _state === STATES.PROGRESS,
    getID: () => _id,
    getLength: () => _length,
    getName: () => _name,
    getHealth: () => _health,
    getOrientation: () => _orientation,
    getPlacedCoordinates: () => _placedCoordinates.map((coordinates) => coordinates.slice()),
    setIsPlaced: (value) => (_isPlaced = value),
    setOrientation: (value) => (_orientation = value),
    setIsSelected: (value) => (_isSelected = value),
    setState: (value) => (_state = value),
    setPlacedCoordinates: (coordinates) => {
      _placedCoordinates.length = 0;
      _placedCoordinates.push(...coordinates);
    },
    clearPlacedCoordinates: () => (_placedCoordinates.length = 0),
    hit: () => {
      if (_health <= 0) return;
      if (_health > 0) _health--;
      return _health === 0 ? -1 : true;
    },
    reset: () => {
      _placedCoordinates.length = 0;
      _health = _length;
    }
  };
};
