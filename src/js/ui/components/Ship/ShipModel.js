import { createSlug } from '../../../utility/utils/stringUtils';
import { SHIP } from '../../common/constants/shipConstants';

export const ShipModel = ({ length, name }) => {
  const _length = length;
  let _id = createSlug(name);
  let _name = name;
  const _placedCoordinates = [];
  let _isPlaced = false;
  let _orientation = SHIP.ORIENTATIONS.VERTICAL;
  let _isSelected = false;
  let _health = length;
  let _state = SHIP.STATES.PLACEMENT;

  return {
    isShip: () => true,
    isSunk: () => _health <= 0,
    isSelected: () => _isSelected,
    isPlaced: () => _isPlaced,
    isVertical: () => _orientation === SHIP.ORIENTATIONS.VERTICAL,
    isPlacementState: () => _state === SHIP.STATES.PLACEMENT,
    isProgressState: () => _state === SHIP.STATES.PROGRESS,
    getID: () => _id,
    getLength: () => _length,
    getName: () => _name,
    getHealth: () => _health,
    getOrientation: () => _orientation,
    getPlacedCoordinates: () => _placedCoordinates.map((coordinates) => coordinates.slice()),
    setName: (value) => {
      if (!value) return;
      const slug = createSlug(value);
      if (slug.length <= 0) return;
      _name = value;
      _id = slug;
    },
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
