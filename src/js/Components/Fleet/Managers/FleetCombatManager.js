import { ManagerFactory } from '../../../Utility/ManagerFactory';
import { FLEET_COMBAT_EVENTS } from '../common/fleetEvents';

const FleetCombatManager = ({ shipCombatManagers, createHandler, isAllShipsSunk }) => {
  const hit = (id) => {
    const ship = shipCombatManagers.get(id);
    if (ship) ship.hit();
  };

  const shipHit = {
    on: (callback) => shipCombatManagers.forEach((manager) => manager.onHit(callback)),
    off: (callback) => shipCombatManagers.forEach((manager) => manager.offHit(callback))
  };

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

  const shipSunk = {
    on: (callback) => shipCombatManagers.forEach((manager) => manager.onSunk(callback)),
    off: (callback) => shipCombatManagers.forEach((manager) => manager.offSunk(callback))
  };

  const start = () => {
    allShipsSunk.init();
    shipCombatManagers.forEach((manager) => {
      manager.start();
      manager.onSunk(allShipsSunk.check);
    });
  };
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
