import { ShipPlacementView } from './ShipPlacementView';
import { SHIP_EVENTS } from '../../../common/shipEvents';

export const ShipPlacementController = ({ model, view, publisher, componentEmitter }) => {
  const placementView = ShipPlacementView(view.elements.getMainShip());

  const execute = {
    place: ({ data }) => {
      const { placedCoordinates } = data;
      model.setPlacedCoordinates(placedCoordinates);
      model.setIsPlaced(true);
      placementView.update.placementStatus(true);
      emit.placementSet();
    },
    pickup: () => {
      model.clearPlacedCoordinates();
      model.setIsPlaced(false);
      placementView.update.placementStatus(false);
    }
  };

  const emit = {
    placementSet: () => {
      publisher.scoped.noFulfill(SHIP_EVENTS.PLACEMENT.SET, { scopedID: model.getScopedID() });
      componentEmitter.publish(SHIP_EVENTS.PLACEMENT.SET);
    },
    requestPlacement: () => {
      publisher.scoped.noFulfill(SHIP_EVENTS.PLACEMENT.REQUESTED, {
        id: model.getID(),
        scopedID: model.getScopedID(),
        length: model.getLength()
      });
    }
  };

  const stateManager = {
    isInitialized: false,
    isEnabled: false,
    initialize: ({ data }) => {
      if (stateManager.isInitialized) return;
      const { container } = data;
      placementView.initialize({
        placementContainer: container,
        requestPlacementCallback: emit.requestPlacement
      });
      componentEmitter.subscribe(
        SHIP_EVENTS.PLACEMENT.ENABLE_PLACEMENT_REQUESTED,
        stateManager.enable
      );
      componentEmitter.subscribe(
        SHIP_EVENTS.PLACEMENT.DISABLE_PLACEMENT_REQUESTED,
        stateManager.disable
      );
      componentEmitter.subscribe(SHIP_EVENTS.PLACEMENT.OVER, stateManager.end);
      stateManager.isInitialized = true;
    },
    enable: () => {
      if (stateManager.isEnabled) return;
      placementView.enable.request();
      componentEmitter.subscribe(
        SHIP_EVENTS.PLACEMENT.PLACEMENT_COORDINATES_RECEIVED,
        execute.place
      );
      componentEmitter.subscribe(SHIP_EVENTS.PLACEMENT.PICKUP_REQUESTED, execute.pickup);
      stateManager.isEnabled = true;
    },
    disable: () => {
      if (!stateManager.isEnabled) return;
      componentEmitter.unsubscribe(SHIP_EVENTS.PLACEMENT.PICKUP_REQUESTED, execute.pickup);
      componentEmitter.unsubscribe(
        SHIP_EVENTS.PLACEMENT.PLACEMENT_COORDINATES_RECEIVED,
        execute.place
      );
      placementView.disable.request();

      placementView.disable.request();
      stateManager.isEnabled = false;
    },
    end: () => {
      if (!stateManager.isInitialized) return;
      stateManager.disable();
      placementView.end();
      stateManager.isInitialized = false;
    }
  };

  componentEmitter.subscribe(SHIP_EVENTS.PLACEMENT.CONTAINER_RECEIVED, stateManager.initialize);
};
