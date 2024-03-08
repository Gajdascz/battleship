import { FLEET_COMBAT_EVENTS } from '../../common/fleetEvents';
import { ManagerFactory } from '../../../../Utility/ManagerFactory';

const FleetCombatManager = ({ combatManagers, createHandler, isAllShipsSunk }) => {
  const hit = {
    execute: ({ data }) => combatManagers.get(data).hit(),
    on: (callback) => combatManagers.forEach((manager) => manager.onHit(callback)),
    off: (callback) => combatManagers.forEach((manager) => manager.offHit(callback))
  };

  const sunk = {
    on: (callback) => combatManagers.forEach((manager) => manager.onSunk(callback)),
    off: (callback) => combatManagers.forEach((manager) => manager.offSunk(callback))
  };

  const allSunk = {
    handler: null,
    checkAll: () => {
      if (isAllShipsSunk()) allSunk.handler.emit();
    },
    on: (callback) => allSunk.handler.on(callback),
    off: (callback) => allSunk.handler.off(callback),
    start: () => (allSunk.handler = createHandler(FLEET_COMBAT_EVENTS.ALL_SHIPS_SUNK)),
    end: () => allSunk.handler.reset()
  };

  const start = () => {
    allSunk.setHandler();
    combatManagers.forEach((controller) => {
      controller.initialize();
      controller.onShipSunk(allSunk.checkAll);
    });
  };
  const end = () => {
    allSunk.end();
    combatManagers.forEach((controller) => controller.end());
  };

  return {
    start,
    end,
    hit: (id) => hit.execute(id),
    onHit: (callback) => hit.on(callback),
    offHit: (callback) => hit.off(callback),
    onSunk: (callback) => sunk.on(callback),
    offSunk: (callback) => sunk.off(callback),
    onAllSunk: (callback) => allSunk.on(callback),
    offAllSunk: (callback) => allSunk.off(callback)
  };
};

export const CombatManagerFactory = ({ shipCombatManagers, createHandler, isAllShipsSunk }) =>
  ManagerFactory({
    ManagerBuilder: FleetCombatManager,
    initialDetails: { shipCombatManagers, createHandler, isAllShipsSunk },
    validateDetails: (details) =>
      details.combatManagers && details.createHandler && details.isAllShipsSunk
  });
