import { FleetModel } from './main/model/FleetModel';
import { FleetView } from './main/view/FleetView';
import { FleetPlacementManager } from './features/placement/FleetPlacementManager';
import { EventEmitter } from '../../Events/core/EventEmitter';
import { FLEET_EVENTS } from './common/fleetEvents';

export const FleetController = (scope) => {
  const model = FleetModel(scope);
  const view = FleetView();
  const shipControllers = new Map();
  const componentEmitter = EventEmitter();

  const placementManager = FleetPlacementManager({ shipControllers, componentEmitter });

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
      requestInitialize: (container) =>
        componentEmitter.publish(FLEET_EVENTS.PLACEMENT.REQUEST.INITIALIZE, container),
      onSelected: (data) => {
        console.log(data);
        componentEmitter.publish(FLEET_EVENTS.PLACEMENT.REQUEST.SUB_SELECTED, { callback: data });
      },
      offSelected: (callback) =>
        componentEmitter.publish(FLEET_EVENTS.PLACEMENT.REQUEST.UNSUB_SELECTED, callback),
      onOrientationToggled: (callback) =>
        componentEmitter.publish(FLEET_EVENTS.PLACEMENT.REQUEST.SUB_ORIENTATION_TOGGLE, callback),
      offOrientationToggled: (callback) =>
        componentEmitter.publish(FLEET_EVENTS.PLACEMENT.REQUEST.UNSUB_ORIENTATION_TOGGLE, callback)
    },
    getView: () => view,
    getModel: () => model,
    getTrackingFleet: () => view.getTrackingFleet(),
    assignShipToFleet,
    isAllShipsSunk: () => model.isAllShipsSunk(),
    isAllShipsPlaced: () => model.isAllShipsPlaced()
  };
};
