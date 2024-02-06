/**
 * @module Player.js
 * Creates a player object to be utilized by the human player or extended as an AI.
 * The player object contains references to their corresponding board and ship objects,
 * identifier properties (name and id), and a reference to their opponents board for orchestrating attacks.
 *
 */

/**
 * Creates a player object.
 * Tracks the individual user provided settings and game related properties.
 *
 * @param {string} name - String representing player provided by user.
 * @param {string} id - String used for reliable player access.
 * @returns {Object} - Player object containing stored settings and game related properties
 */
export default function createPlayer(name = '', id = '') {
  let _name = validateName(name);
  let _board = null;
  let _type = 'human';
  let _id = id;
  const _fleet = [];
  let _opponentsBoard = null;

  // Prevents users from entering an empty name.
  function validateName(name) {
    // Mutinous: (of a solider or sailor) refusing to obey the orders of a person in authority.
    if (typeof name !== 'string' || !name.trim()) return 'Mutinous';
    else return name.trim();
  }

  // Validates if a ship is a proper ship object to ensure fleet integrity.
  const isValidShip = (ship) => ship && ship.isShip;

  /**
   * Populate the users' fleet.
   * Tracks ship status provides information for game state.
   *
   * @param {Object[] | Object} ships - Array of ship objects, or, a single ship object.
   */
  const addShip = (ships) => {
    if (isValidShip(ships)) {
      _fleet.push(ships);
      return true;
    }
    if (Array.isArray(ships)) {
      ships.forEach((ship) => {
        if (!isValidShip(ship))
          throw new Error(
            `Invalid ship detected in the array. Cannot be added to player's fleet: ${ship}`
          );
      });
      _fleet.push(...ships);
      return true;
    }
    throw new Error(
      `Invalid input. Expected a ship object or an array of ship objects. Received: ${ships}`
    );
  };

  /**
   * Removes a ship from the player's fleet.
   * Allows re-initialization and potential future configuration of the fleet.
   *  - If no parameter is passed, it removes the first ship in the fleet array.
   *  - If a parameter is provided, it attempts to remove a ship based on the given ID.
   *  - The function is case-insensitive and ignores spaces in the ship ID.
   *
   * @param {string} [removeThisShip=null] - The ID of the ship to be removed.
   * @returns {boolean} - Returns true if a ship is successfully found and removed, false otherwise.
   */
  const removeShip = (removeThisShip = null) => {
    if (removeThisShip === null) {
      _fleet.splice(0, 1);
      return true;
    }
    if (_fleet.length === 0 || removeThisShip.trim() === '') return false;
    const shipID = removeThisShip.toLocaleLowerCase().replaceAll(' ', '-');
    _fleet.forEach((ship, index) => {
      if (ship.id === shipID) {
        _fleet.splice(index, 1);
        return true;
      }
    });
    return false;
  };

  /**
   * Validates that the passed board is a references the stored opponents board object.
   * Provides improved testing and integrity assurance capabilities.
   *
   * @param {Object} board - Board instance to test.
   * @returns {boolean} - True if board references the same object instance, false otherwise.
   */
  const opponentsBoardIsReferenceTo = (board) => board === _opponentsBoard;

  return {
    get name() {
      return _name;
    },
    set name(newName) {
      _name = validateName(newName);
    },
    get board() {
      return _board;
    },
    get hasOpponentsBoard() {
      return _opponentsBoard?.isBoard;
    },
    set board(newBoard) {
      _board = newBoard;
    },
    get fleet() {
      return _fleet;
    },
    set opponentsBoard(newBoard) {
      _opponentsBoard = newBoard;
    },
    get isPlayer() {
      return true;
    },
    get type() {
      return _type;
    },
    set type(newType) {
      _type = newType;
    },
    get id() {
      return _id;
    },
    set id(newID) {
      _id = newID;
    },
    addShip,
    removeShip,
    // Coordinates attacks between the current and opponent player's boards.
    sendOutgoingAttack(coordinates) {
      return _board.outgoingAttack(coordinates, _opponentsBoard);
    },
    clearFleet() {
      this.fleet.length = 0;
    },
    getLastOpponentShipSunk: () => _opponentsBoard?.lastShipSunk,
    opponentsBoardIsReferenceTo
  };
}
