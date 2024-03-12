import { ManagerFactory } from '../../../../Utility/ManagerFactory';

const FleetCombatManager = ({ shipCombatManagers, createHandler, isAllShipsSunk }) => {
  const hit = (id) => {
    const ship = shipCombatManagers.get(id);
    ship.hit();
    return ship.isSunk();
  };

  const start = () => {
    shipCombatManagers.forEach((manager) => {
      manager.initialize();
    });
  };
  const end = () => {
    shipCombatManagers.forEach((controller) => controller.end());
  };

  return {
    start,
    end,
    hit
  };
};

export const CombatManagerFactory = ({ shipCombatManagers, createHandler, isAllShipsSunk }) =>
  ManagerFactory({
    ManagerBuilder: FleetCombatManager,
    initialDetails: { shipCombatManagers, createHandler, isAllShipsSunk },
    validateDetails: (details) =>
      details.shipCombatManagers && details.createHandler && details.isAllShipsSunk
  });
