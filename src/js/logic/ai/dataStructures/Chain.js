import Dequeue from './Dequeue';
import { validateCoordinates } from '../utilities/inputValidators';
import {
  getDelta,
  isAdjacent,
  getRelativeOrientation,
  doCoordinatesMatchOrientation,
  getOrientationDirections
} from '../utilities/coordinatesHelpers';

export default function Chain({ coordinates = null, orientation = null } = {}) {
  let _chain = Dequeue();
  let _orientation = orientation;
  let _afterHeadDirection = null;
  let _afterTailDirection = null;
  let _currentDirection = null;

  const isAdjacentToTail = (coordinates) => isAdjacent(coordinates, _chain.peekTail());
  const isAdjacentToHead = (coordinates) => isAdjacent(coordinates, _chain.peekHead());

  const canExtendChain = (coordinates, orientation = _orientation) =>
    doCoordinatesMatchOrientation(orientation, coordinates, _chain.peekTail()) &&
    (isAdjacentToTail(coordinates) || isAdjacentToHead(coordinates));

  const setDirections = ({ coordinates = null, initialDirection = null }) => {
    _currentDirection = initialDirection ?? getDelta(_chain.peekHead(), coordinates);
    _afterTailDirection = _currentDirection;
    _afterHeadDirection = [-_currentDirection[0], -_currentDirection[1]];
  };

  const setFirstInChain = (coordinates) => {
    _chain.pushFront(coordinates);
    if (_chain.size() === 1) return true;
    return false;
  };

  const initializeChain = (coordinates) => {
    const orientation = getRelativeOrientation(_chain.peekHead(), coordinates);
    if (canExtendChain(coordinates, orientation)) {
      setDirections({ coordinates });
      _orientation = orientation;
      _chain.pushBack(coordinates);
      return true;
    }
    return false;
  };

  const updateChain = (coordinates) => {
    if (isAdjacentToTail(coordinates)) {
      _currentDirection = getDelta(_chain.peekTail(), coordinates);
      _chain.pushBack(coordinates);
    } else {
      _currentDirection = getDelta(_chain.peekHead(), coordinates);
      _chain.pushFront(coordinates);
    }
    return true;
  };

  const addCoordinates = (coordinates) => {
    try {
      validateCoordinates(coordinates);
    } catch (error) {
      console.error(error);
      return false;
    }
    if (_chain.isEmpty()) return setFirstInChain(coordinates);
    if (_chain.size() === 1) return initializeChain(coordinates);
    if (canExtendChain(coordinates)) return updateChain(coordinates);
  };

  if (coordinates) addCoordinates(coordinates);
  if (orientation) {
    const directions = getOrientationDirections(orientation);
    const orientationDirectionVectors = Object.values(directions);
    const initialDirection =
      orientationDirectionVectors[Math.floor(orientationDirectionVectors.length * Math.random())];
    setDirections({ initialDirection });
  }
  return {
    addCoordinates,
    size: () => _chain.size(),
    peekHead: () => _chain.peekHead(),
    peekTail: () => _chain.peekTail(),
    getOrientation: () => _orientation,
    isEmpty: () => _chain.isEmpty(),
    getCurrentDirection: () => _currentDirection,
    getAfterHeadDirection: () => _afterHeadDirection,
    getAfterTailDirection: () => _afterTailDirection,
    popTail: () => _chain.popBack(),
    popHead: () => _chain.popFront(),
    copyChainToArray: () => _chain.copyToArray(),
    reset: () => {
      _chain = Dequeue();
      _orientation = null;
      _currentDirection = null;
    },
    isInitialized: () =>
      _chain.size() > 0 &&
      _orientation !== null &&
      _currentDirection !== null &&
      _afterHeadDirection !== null &&
      _afterTailDirection !== null
  };
}
