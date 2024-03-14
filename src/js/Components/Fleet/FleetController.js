import { FleetModel } from './main/model/FleetModel';
import { FleetView } from './main/view/FleetView';
import { PlacementManagerFactory } from './features/placement/FleetPlacementManager';
import { CombatManagerFactory } from './features/combat/FleetCombatManager';
import { EventEmitter } from '../../Events/core/EventEmitter';
import { EventHandler } from '../../Events/management/EventHandler';

export const FleetController = (fleetShipControllers) => {
  const model = FleetModel();
  const view = FleetView();
  const shipControllers = new Map();
  const emitter = EventEmitter();
  const createHandler = (eventName, callback = (args) => args) =>
    EventHandler(emitter, eventName, callback);

  const placement = {
    manager: null,
    shipPlacementManagers: new Map(),
    addShipPlacementManager: (id, manager) => placement.shipPlacementManagers.set(id, manager),
    setManager: () => {
      if (placement.manager) placement.manager.getManager().end();
      placement.manager = PlacementManagerFactory({
        shipPlacementManagers: placement.shipPlacementManagers,
        createHandler,
        isAllShipsPlaced: model.isAllShipsPlaced
      });
    },
    getPlacementManager: () => {
      if (!placement.manager) placement.setManager();
      return placement.manager.getManager();
    }
  };

  const combat = {
    manager: null,
    shipCombatManagers: new Map(),
    addShipCombatManager: (id, manager) => combat.shipCombatManagers.set(id, manager),
    setManger: () => {
      if (combat.manager) combat.manager.getManager().end();
      combat.manager = CombatManagerFactory({
        shipCombatManagers: combat.shipCombatManagers,
        createHandler,
        isAllShipsSunk: model.isAllShipsSunk
      });
    },
    getCombatManager: () => {
      if (!combat.manager) combat.setManger();
      return combat.manager.getManager();
    }
  };
  const assignShipToFleet = (shipController) => {
    const shipModel = shipController.getModel();
    const shipId = shipModel.id;
    model.addMainShip(shipId, shipModel);
    shipControllers.set(shipId, shipController);
    view.addShipView(shipId, shipController.getView());
    view.populateFleetShipLists();
    placement.addShipPlacementManager(shipId, shipController.getPlacementManager());
    combat.addShipCombatManager(shipId, shipController.getCombatManager());
  };

  if (fleetShipControllers) fleetShipControllers.forEach(assignShipToFleet);
  return {
    getPlacementManager: () => placement.getPlacementManager(),
    getCombatManager: () => combat.getCombatManager(),
    view,
    getModel: () => model,
    getTrackingFleet: () => view.getTrackingFleet(),
    assignShipToFleet
  };
};
