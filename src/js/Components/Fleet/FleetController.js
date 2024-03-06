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
  const componentEmitter = EventEmitter();
  const { publish } = componentEmitter;

  const assignShipToFleet = (shipController) => {
    const shipModel = shipController.getModel();
    const shipID = shipModel.getID();
    model.addMainShip(shipID, shipModel);
    shipControllers.set(shipID, shipController);
    view.addShipView(shipID, shipController.getView());
    view.populateFleetShipLists();
  };

  return {
    placement: {
      initialize: (container) => {
        const placementControllers = new Map();
        [...shipControllers.entries()].forEach((controller) =>
          placementControllers.set(controller[0], controller[1].placement)
        );
        FleetPlacementManager(placementControllers, componentEmitter, model.isAllShipsPlaced);
        publish(FLEET_PLACEMENT_EVENTS.INITIALIZE, container);
      },
      isAllShipsPlaced: () => model.isAllShipsPlaced(),
      setCoordinates: (coordinates) => publish(FLEET_PLACEMENT_EVENTS.SET_COORDINATES, coordinates),
      onSelected: (callback) => publish(FLEET_PLACEMENT_EVENTS.SUB_SELECTED, callback),
      offSelected: (callback) => publish(FLEET_PLACEMENT_EVENTS.UNSUB_SELECTED, callback),
      onOrientationToggled: (callback) =>
        publish(FLEET_PLACEMENT_EVENTS.SUB_ORIENTATION_TOGGLED, callback),
      offOrientationToggled: (callback) =>
        publish(FLEET_PLACEMENT_EVENTS.UNSUB_ORIENTATION_TOGGLED, callback),
      onAllShipsPlaced: (callback) =>
        publish(FLEET_PLACEMENT_EVENTS.SUB_ALL_SHIPS_PLACED, callback),
      offAllShipsPlaced: (callback) =>
        publish(FLEET_PLACEMENT_EVENTS.UNSUB_ALL_SHIPS_PLACED, callback),
      onShipNoLongerPlaced: (callback) =>
        publish(FLEET_PLACEMENT_EVENTS.SUB_SHIP_NO_LONGER_PLACED, callback),
      offShipNoLongerPlaced: (callback) =>
        publish(FLEET_PLACEMENT_EVENTS.UNSUB_SHIP_NO_LONGER_PLACED, callback),
      end: () => publish(FLEET_PLACEMENT_EVENTS.END)
    },
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
      isAllShipsSunk: () => model.isAllShipsSunk(),
      isAllShipsPlaced: () => model.isAllShipsPlaced()
    },
    getView: () => view,
    getModel: () => model,
    getTrackingFleet: () => view.getTrackingFleet(),
    assignShipToFleet
  };
};
