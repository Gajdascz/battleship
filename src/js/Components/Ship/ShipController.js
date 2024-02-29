import { ShipModel } from './model/ShipModel';
import { ShipView } from './view/ShipView';
import { SHIP_EVENTS } from './events/shipEvents';

import { MAIN_GRID_EVENTS } from '../Grids/MainGrid/utility/mainGridEvents';
import { ShipSelectionController } from './Selection/ShipSelectionController';
import { ShipPlacementController } from './Placement/ShipPlacementController';
import { EventManager } from '../../Events/management/EventManager';
import { GameStateManager } from '../../State/GameStateManager';
import stateManagerRegistry from '../../State/stateManagerRegistry';

export const ShipController = (scope, shipData) => {
  const { name, length } = shipData;
  const model = ShipModel(scope, { shipName: name, shipLength: length });
  const view = ShipView({ name, length });
  const { publisher, componentEmitter, subscriptionManager, resetEventManager } =
    EventManager(scope);

  ShipSelectionController({
    model,
    view,
    publisher,
    componentEmitter
  });
  ShipPlacementController({
    model,
    view,
    publisher,
    componentEmitter
  });
  const stateManager = GameStateManager(model.getScopedID());

  const selectionAndPlacementManager = {
    initialize: () => {
      componentEmitter.publish(SHIP_EVENTS.SELECTION.INITIALIZE_REQUESTED);
      subscriptionManager.scoped.subscribe(
        MAIN_GRID_EVENTS.PLACEMENT.GRID_INITIALIZED,
        selectionAndPlacementManager.handle.containerCreated
      );
    },
    handle: {
      containerCreated: ({ data }) => {
        componentEmitter.publish(SHIP_EVENTS.PLACEMENT.CONTAINER_RECEIVED, data);
        publisher.scoped.noFulfill(SHIP_EVENTS.PLACEMENT.CONTAINER_RECEIVED);
      },
      placementCoordinatesReceived: ({ data }) => {
        componentEmitter.publish(SHIP_EVENTS.PLACEMENT.PLACEMENT_COORDINATES_RECEIVED, data);
        selectionAndPlacementManager.handle.deselection();
      },
      selection: () => {
        componentEmitter.publish(SHIP_EVENTS.SELECTION.SELECTION_REQUESTED);
        componentEmitter.publish(SHIP_EVENTS.PLACEMENT.ENABLE_PLACEMENT_REQUESTED);
        if (model.isPlaced()) componentEmitter.publish(SHIP_EVENTS.PLACEMENT.PICKUP_REQUESTED);
        subscriptionManager.scoped.subscribe(
          MAIN_GRID_EVENTS.PLACEMENT.ENTITY_PLACEMENT_PROCESSED,
          selectionAndPlacementManager.handle.placementCoordinatesReceived
        );
      },
      deselection: () => {
        componentEmitter.publish(SHIP_EVENTS.SELECTION.DESELECT_REQUESTED);
        componentEmitter.publish(SHIP_EVENTS.PLACEMENT.DISABLE_PLACEMENT_REQUESTED);
        subscriptionManager.scoped.unsubscribe(
          MAIN_GRID_EVENTS.PLACEMENT.ENTITY_PLACEMENT_PROCESSED,
          selectionAndPlacementManager.handle.placementCoordinatesReceived
        );
      }
    },
    end: () => {
      selectionAndPlacementManager.handle.deselection();
      subscriptionManager.scoped.unsubscribe(
        MAIN_GRID_EVENTS.PLACEMENT.GRID_INITIALIZED,
        selectionAndPlacementManager.handle.containerCreated
      );
      componentEmitter.publish(SHIP_EVENTS.SELECTION.OVER);
      componentEmitter.publish(SHIP_EVENTS.PLACEMENT.OVER);
    }
  };
  stateManager.setFunctions.placement({
    enterFns: selectionAndPlacementManager.initialize,
    exitFns: selectionAndPlacementManager.end
  });

  return {
    properties: {
      getScoped: () => model.getScope(),
      getID: () => model.getID(),
      getScopedID: () => model.getScopedID(),
      isSelected: () => model.isSelected()
    },
    placement: {
      select: () => selectionAndPlacementManager.handle.selection(),
      deselect: () => selectionAndPlacementManager.handle.deselection()
    },
    getModel: () => model,
    getView: () => view,
    initializeStateManagement: () => stateManagerRegistry.registerManager(stateManager)
  };
};
