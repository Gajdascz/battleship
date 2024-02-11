import { STATES } from '../../utility/constants/common';

/**
 * Creates a model for managing the fleet in a battleship game. This model
 * handles ship data, tracking ships, and the game state (placement or progress).
 *
 * @returns {object} An object representing the fleet model with methods to interact with the fleet's state.
 */
export const FleetModel = () => {
  // Map to store the player's ships with their IDs as keys.
  const _fleet = new Map();
  // Map to store tracking information for opponent's ships.
  const _trackingFleet = new Map();
  // Current state of the game (placement or progress).
  let _state = null;

  return {
    /**
     * Checks if all ships in the fleet are placed.
     *
     * @returns {boolean} True if all ships are placed, false otherwise.
     */
    isAllShipsPlaced: () => [..._fleet.values()].every((ship) => ship.isPlaced()),

    /**
     * Checks if the current state is placement.
     *
     * @returns {boolean} True if the current state is placement, false otherwise.
     */
    isPlacementState: () => _state === STATES.PLACEMENT,

    /**
     * Checks if the current state is progress.
     *
     * @returns {boolean} True if the current state is progress, false otherwise.
     */
    isProgressState: () => _state === STATES.PROGRESS,

    /**
     * Gets the current state of the game.
     *
     * @returns {string|null} The current state of the game.
     */
    getState: () => _state,

    /**
     * Sets the state of the game.
     *
     * @param {string} value The new state of the game.
     */
    setState: (value) => (_state = value),

    /**
     * Adds a ship to the fleet.
     *
     * @param {object} ship The ship object to add.
     */
    addShip: (ship) => _fleet.set(ship.id, ship),

    /**
     * Adds a ship to the tracking fleet.
     *
     * @param {object} ship The tracking ship object to add.
     */
    addTrackingShip: (ship) => _trackingFleet.set(ship.id, ship),

    /**
     * Sets a ship's status to sunk based on its ID.
     *
     * @param {string} shipID The ID of the ship to mark as sunk.
     */
    setSunk: (shipID) => _fleet.get(shipID).setSunk(),

    /**
     * Sets a tracking ship's status to sunk based on its ID.
     *
     * @param {string} shipID The ID of the tracking ship to mark as sunk.
     */
    setTrackingSunk: (shipID) => _trackingFleet.get(shipID).setSunk(),

    getFleet: () => [..._fleet.values()],
    getTrackingFleet: () => [..._trackingFleet.values()]
  };
};
