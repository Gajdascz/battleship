import { FleetModel } from './main/model/FleetModel';
import { FleetView } from './main/view/FleetView';
import { EventManager } from '../../Events/management/EventManager';
import { GameStateManager } from '../../State/GameStateManager';
import stateManagerRegistry from '../../State/stateManagerRegistry';
import { FleetPlacementManager } from './features/placement/FleetPlacementManager';
import { SHIP_EVENTS } from '../Ship/common/shipEvents';

export const FleetController = (scope) => {
  const model = FleetModel(scope);
  const view = FleetView();
  const { publisher, componentEmitter, subscriptionManager } = EventManager(scope);
  const shipControllers = new Map();
  const stateManager = GameStateManager(model.getScopedID());

  const placementManager = FleetPlacementManager({
    shipControllers,
    publisher,
    subscriptionManager
  });

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

  const selectShip = ({ data }) => {
    const { scopedID } = data;
    shipControllers.forEach((controller) => {
      if (controller.properties.getScopedID() === scopedID) controller.placement.select();
      else if (controller.properties.isSelected()) controller.placement.deselect();
    });
  };

  const subscribeSelect = (callback) =>
    shipControllers.forEach((controller) => controller.placement.subscribe.select(callback));

  const subscribeOrientationToggled = (callback) =>
    shipControllers.forEach((controller) =>
      controller.placement.subscribe.orientationToggled(callback)
    );

  const setFleetPlacementContainer = (container) =>
    shipControllers.forEach((controller) => controller.placement.initialize(container));

  const initializeCombat = () => {
    subscriptionManager.scoped.subscribe(SHIP_EVENTS.COMBAT.HIT_REQUESTED, processShipHitRequest);
  };
  const endCombat = () => {
    subscriptionManager.scoped.unsubscribe(SHIP_EVENTS.COMBAT.HIT_REQUESTED, processShipHitRequest);
  };

  stateManager.setFunctions.progress({
    enterFns: initializeCombat,
    exitFns: endCombat
  });

  return {
    placement: {
      selectShip,
      setFleetPlacementContainer,
      subscribeSelect,
      subscribeOrientationToggled
    },
    getView: () => view,
    getModel: () => model,
    getTrackingFleet: () => view.getTrackingFleet(),
    assignShipToFleet,
    initializeStateManagement: () => {
      shipControllers.forEach((ship) => ship.initializeStateManagement());
      stateManagerRegistry.registerManager(stateManager);
    },
    isAllShipsSunk: () => model.isAllShipsSunk(),
    isAllShipsPlaced: () => model.isAllShipsPlaced()
  };
};
