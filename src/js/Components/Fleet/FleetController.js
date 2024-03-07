import { FleetModel } from './main/model/FleetModel';
import { FleetView } from './main/view/FleetView';
import { FleetPlacementManager } from './features/placement/FleetPlacementManager';
import { EventEmitter } from '../../Events/core/EventEmitter';
import { FLEET_COMBAT_EVENTS, FLEET_PLACEMENT_EVENTS } from './common/fleetEvents';
import { FleetCombatManager } from './features/combat/FleetCombatManager';

export const FleetController = (scope) => {
  const model = FleetModel(scope);
  const view = FleetView();
  const shipControllers = new Map();
  const emitter = EventEmitter();
  const { publish } = emitter;

  const assignShipToFleet = (shipController) => {
    const shipModel = shipController.getModel();
    const shipID = shipModel.getId();
    model.addMainShip(shipID, shipModel);
    shipControllers.set(shipID, shipController);
    view.addShipView(shipID, shipController.getView());
    view.populateFleetShipLists();
    console.log(shipControllers);
  };
  const placement = {
    manager: null,
    getShipManagers: () => {
      const placementManagers = new Map();
      [...shipControllers.entries()].forEach((controller) =>
        placementManagers.set(controller[0], controller[1].placementManager)
      );
      return placementManagers;
    },
    initialize: () => {
      if (placement.manager) placement.manager.end();
      placement.manager = FleetPlacementManager({
        placementManagers: placement.getShipManagers(),
        emitter,
        isAllShipsPlaced: model.isAllShipsPlaced
      });
    },
    getManager: () => {
      if (!placement.manager) placement.initialize();
      return placement.manager;
    }
  };

  return {
    getPlacementManager: () => placement.getManager(),
    combat: {
      initialize: () => {
        const combatControllers = new Map();
        [...shipControllers.entries()].forEach((controller) =>
          combatControllers.set(controller[0], controller[1].combat)
        );
        FleetCombatManager(combatControllers, componentEmitter, model.isAllShipsSunk);
        publish(FLEET_COMBAT_EVENTS.INITIALIZE);
      },
      hitShip: (shipId) => publish(FLEET_COMBAT_EVENTS.HIT_SHIP, shipId),
      onShipHit: (callback) => publish(FLEET_COMBAT_EVENTS.SUB_SHIP_HIT, callback),
      offShipHit: (callback) => publish(FLEET_COMBAT_EVENTS.UNSUB_SHIP_HIT, callback),
      onShipSunk: (callback) => publish(FLEET_COMBAT_EVENTS.SUB_SHIP_SUNK, callback),
      offShipSunk: (callback) => publish(FLEET_COMBAT_EVENTS.UNSUB_SHIP_SUNK, callback),
      onAllShipsSunk: (callback) => publish(FLEET_COMBAT_EVENTS.SUB_ALL_SHIPS_SUNK, callback),
      offAllShipsSunk: (callback) => publish(FLEET_COMBAT_EVENTS.UNSUB_ALL_SHIPS_SUNK, callback),
      end: () => publish(FLEET_COMBAT_EVENTS.END)
    },
    view: {
      attachMainFleetTo: (container) => view.attachMainFleetTo(container),
      attachTrackingFleetTo: (container) => view.attachTrackingFleetTo(container),
      addShipView: (shipID, shipView) => view.addShipView(shipID, shipView),
      populateFleetShipLists: () => view.populateFleetShipLists(),
      getRotateShipButton: (shipID) => view.elements.getRotateShipButton(shipID),
      getMainFleet: () => view.elements.getMainFleet(),
      getTrackingFleet: () => view.elements.getTrackingFleet()
    },
    properties: {
      isAllShipsSunk: () => model.isAllShipsSunk()
    },
    getView: () => view,
    getModel: () => model,
    getTrackingFleet: () => view.getTrackingFleet(),
    assignShipToFleet
  };
};
