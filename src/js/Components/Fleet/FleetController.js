import { FleetModel } from './main/model/FleetModel';
import { FleetView } from './main/view/FleetView';
import { FleetPlacementManager } from './features/placement/FleetPlacementManager';
import { EventEmitter } from '../../Events/core/EventEmitter';
import { FLEET_PLACEMENT_EVENTS } from './common/fleetEvents';

export const FleetController = (scope) => {
  const model = FleetModel(scope);
  const view = FleetView();
  const shipControllers = new Map();
  const componentEmitter = EventEmitter();
  const { publish } = componentEmitter;

  const placementManager = FleetPlacementManager({ model, shipControllers, componentEmitter });

  const assignShipToFleet = (shipController) => {
    const shipModel = shipController.getModel();
    const shipID = shipModel.getID();
    model.addMainShip(shipID, shipModel);
    shipControllers.set(shipID, shipController);
    view.addShipView(shipID, shipController.getView());
    view.populateFleetShipLists();
  };

  const processShipHitRequest = ({ data }) => {
    const { shipID } = data;
    const ship = shipControllers.get(shipID);
    if (ship) ship.combat.hit();
  };

  return {
    placement: {
      initialize: (container) => publish(FLEET_PLACEMENT_EVENTS.INITIALIZE, container),
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
