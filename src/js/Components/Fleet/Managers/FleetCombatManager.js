import { ManagerFactory } from '../../../Utility/ManagerFactory';
import { FLEET_COMBAT_EVENTS } from '../common/fleetEvents';

/**
 * Manages the combat between players by coordinating individual ship combat managers.
 * Provides a central method for finding and executing hit logic on a ship within the fleet.
 * Tracks overall state and emits events related to combat interactions.
 *
 * @param {Object} detail Initialization detail.
 * @param {Array} detail.shipCombatManagers Array of shipCombatManager instances.
 * @param {function} detail.createHandler Method for creating an EventHandler instance.
 * @param {function} detail.isAllShipsSunk Method to determine if all ships have been sunk.
 * @returns {Object} Interface providing fleet combat management capabilities.
 */
const FleetCombatManager = ({ shipCombatManagers, createHandler, isAllShipsSunk }) => {
  const hit = (id) => {
    const ship = shipCombatManagers.get(id);
    if (ship) ship.hit();
  };

  /**
   * Manages subscriptions to the hit event on all ships in the fleet.
   */
  const shipHit = {
    on: (callback) => shipCombatManagers.forEach((manager) => manager.onHit(callback)),
    off: (callback) => shipCombatManagers.forEach((manager) => manager.offHit(callback))
  };

  /**
   * Manages the all ships sunk event and state notifying subscribers when necessary.
   */
  const allShipsSunk = {
    handler: null,
    check: () => {
      if (isAllShipsSunk()) allShipsSunk.handler.emit();
    },
    init: () => {
      if (!allShipsSunk.handler)
        allShipsSunk.handler = createHandler(FLEET_COMBAT_EVENTS.ALL_SHIPS_SUNK);
    },
    on: (callback) => allShipsSunk.handler.on(callback),
    off: (callback) => allShipsSunk.handler.off(callback),
    reset: () => allShipsSunk.handler.reset()
  };

  /**
   * Manages subscriptions to the sunk event on all ships in the fleet.
   */
  const shipSunk = {
    on: (callback) => shipCombatManagers.forEach((manager) => manager.onSunk(callback)),
    off: (callback) => shipCombatManagers.forEach((manager) => manager.offSunk(callback))
  };

  /**
   * Initializes all ship combat managers and own handlers.
   */
  const start = () => {
    allShipsSunk.init();
    shipCombatManagers.forEach((manager) => {
      manager.start();
      manager.onSunk(allShipsSunk.check);
    });
  };
  /**
   * Resets all ship combat managers and own handlers.
   */
  const end = () => {
    shipCombatManagers.forEach((manager) => manager.end());
    allShipsSunk.reset();
  };

  return {
    start,
    end,
    hit,
    onShipHit: shipHit.on,
    offShipHit: shipHit.off,
    onShipSunk: shipSunk.on,
    offShipSunk: shipSunk.off,
    onAllShipsSunk: allShipsSunk.on,
    offAllShipsSunk: allShipsSunk.off
  };
};

export const CombatManagerFactory = ({ shipCombatManagers, createHandler, isAllShipsSunk }) =>
  ManagerFactory({
    ManagerBuilder: FleetCombatManager,
    initialDetails: { shipCombatManagers, createHandler, isAllShipsSunk },
    validateDetails: (details) =>
      details.shipCombatManagers && details.createHandler && details.isAllShipsSunk
  });
