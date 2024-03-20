import Dequeue from '../../../../../../Utility/dataStructures/Dequeue';
import { validateCoordinates } from '../../../../../../Utility/utils/validationUtils';
import {
  getDelta,
  isAdjacent,
  getRelativeOrientation,
  doCoordinatesMatchOrientation,
  getOrientationDirections
} from '../../../../../../Utility/utils/coordinatesUtils';

/**
 * Initializes a Chain data structure which tracks and manages information
 * related to consecutive and adjacent coordinates in a 2D grid.
 *
 * @param {Object} [detail=null] Initialization details.
 * @returns {Object} Interface for interacting with Chain structure.
 */
export default function Chain({ coordinates = null, startingOrientation = null } = {}) {
  let chain = Dequeue();
  let orientation = startingOrientation;
  let afterHeadDirection = null;
  let afterTailDirection = null;
  let currentDirection = null;

  const isAdjacentToTail = (coordinates) => isAdjacent(coordinates, chain.peekTail());
  const isAdjacentToHead = (coordinates) => isAdjacent(coordinates, chain.peekHead());

  /**
   * Tests if a given coordinate pair meets the criteria for extending the current chain.
   * The coordinates much align with the current orientation and extend at the head or tail of the chain.
   *
   * @param {number[]} coordinates Coordinates to test against current chain state.
   * @param {string} inOrientation Orientation cell should follow.
   * @returns {boolean} True if coordinates can extend chain, false otherwise.
   */
  const canExtendChain = (coordinates, inOrientation = orientation) =>
    doCoordinatesMatchOrientation(inOrientation, coordinates, chain.peekTail()) &&
    (isAdjacentToTail(coordinates) || isAdjacentToHead(coordinates));

  /**
   * Sets the chain's direction state and provides the relative directions for extending at the head or tail end.
   * Provides easy-access to a consistent method of extending the chain in either direction.
   *
   * @param {Object} detail Contains coordinate pair and direction to set.
   */
  const setDirections = ({ coordinates = null, initialDirection = null }) => {
    currentDirection = initialDirection ?? getDelta(chain.peekHead(), coordinates);
    afterTailDirection = currentDirection;
    afterHeadDirection = [-currentDirection[0], -currentDirection[1]];
  };

  /**
   * Sets the first coordinate pair in the chain.
   * Creates the root coordinates to establish a chain upon.
   *
   * @param {number[]} coordinates Coordinate pair to set as the first in a chain.
   * @returns {boolean} True if set, false otherwise.
   */
  const setFirstInChain = (coordinates) => {
    chain.pushFront(coordinates);
    if (chain.size() === 1) return true;
    return false;
  };

  /**
   * Initializes the chain by extending from the first set coordinates and setting the direction of the chain.
   * The coordinates are always set as the tail of the chain providing a consistent approach calculating direction.
   *
   * @param {number[]} coordinates Coordinates to initialize chain with.
   * @returns {boolean} True if initialization successful, false otherwise.
   */
  const initializeChain = (coordinates) => {
    const relativeOrientation = getRelativeOrientation(chain.peekHead(), coordinates);
    if (canExtendChain(coordinates, relativeOrientation)) {
      setDirections({ coordinates });
      orientation = relativeOrientation;
      chain.pushBack(coordinates);
      return true;
    }
    return false;
  };

  /**
   * Extends the chain at the head or tail and updates the current direction accordingly.
   *
   * @param {number[]} coordinates Coordinates to extend chain with.
   * @returns {boolean} True if extension is successful, false otherwise.
   */
  const updateChain = (coordinates) => {
    if (isAdjacentToTail(coordinates)) {
      currentDirection = getDelta(chain.peekTail(), coordinates);
      chain.pushBack(coordinates);
    } else {
      currentDirection = getDelta(chain.peekHead(), coordinates);
      chain.pushFront(coordinates);
    }
    return true;
  };

  /**
   * Adds coordinates to the chain based on chain state and coordinate pair validity.
   *
   * @param {number[]} coordinates Coordinates to add to chain.
   * @returns {boolean} True if coordinates added, false otherwise.
   */
  const addCoordinates = (coordinates) => {
    try {
      validateCoordinates(coordinates);
    } catch (error) {
      console.error(error);
      return false;
    }
    if (chain.isEmpty()) return setFirstInChain(coordinates);
    if (chain.size() === 1) return initializeChain(coordinates);
    if (canExtendChain(coordinates)) return updateChain(coordinates);
  };

  if (coordinates) addCoordinates(coordinates);
  if (startingOrientation) {
    const directions = getOrientationDirections(startingOrientation);
    const orientationDirectionVectors = Object.values(directions);
    const initialDirection =
      orientationDirectionVectors[Math.floor(orientationDirectionVectors.length * Math.random())];
    setDirections({ initialDirection });
  }
  return {
    addCoordinates,
    size: () => chain.size(),
    peekHead: () => chain.peekHead(),
    peekTail: () => chain.peekTail(),
    getOrientation: () => orientation,
    isEmpty: () => chain.isEmpty(),
    getCurrentDirection: () => currentDirection,
    getAfterHeadDirection: () => afterHeadDirection,
    getAfterTailDirection: () => afterTailDirection,
    popTail: () => chain.popBack(),
    popHead: () => chain.popFront(),
    copyChainToArray: () => chain.copyToArray(),
    reset: () => {
      chain = Dequeue();
      orientation = null;
      currentDirection = null;
    },
    isInitialized: () =>
      chain.size() > 0 &&
      orientation !== null &&
      currentDirection !== null &&
      afterHeadDirection !== null &&
      afterTailDirection !== null
  };
}
