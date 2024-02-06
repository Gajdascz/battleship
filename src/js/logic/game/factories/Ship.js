/**
 * @module Ship.js
 * Factory for creating Ship Objects to be used in Battleship.
 * Used to be placed on a players board and allows for tracking the ships health,
 * which is initially equal to its length, and state, whether it's sunk or not.
 *
 */

/**
 * Creates a ship object.
 * Handles internal logical interactions and tracking of ship state.
 *
 * @param {number} length Length representing health and space required on board.
 * @param {string} name Name representation of the ship.
 * @returns {Object} Ship object with properties and methods for game functionality.
 */
export default function createShip(length, name = null) {
  const setID = () => (name ? name.toLowerCase().replaceAll(' ', '-') : null);
  const _length = length;
  let _health = length;
  let _name = name;
  let _id = setID(); // Used for reliable access to the object
  return {
    // Decrements the ship's health and returns true if valid
    hit() {
      if (this.isSunk) return false;
      return _health-- && true;
    },
    get isSunk() {
      return _health === 0;
    },
    get isShip() {
      return true;
    },
    get name() {
      return _name;
    },
    set name(newName) {
      _name = newName;
      _id = setID();
    },
    get health() {
      return _health;
    },
    get length() {
      return _length;
    },
    get id() {
      return _id;
    },
    reset: () => (_health = _length)
  };
}
