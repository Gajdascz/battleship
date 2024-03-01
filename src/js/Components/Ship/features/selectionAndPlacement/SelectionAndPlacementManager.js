// Ship Component
import { SHIP_EVENTS } from '../../common/shipEvents';
import { ShipSelectionController } from './selection/ShipSelectionController';
import { ShipPlacementController } from './placement/ShipPlacementController';
// External
import { MAIN_GRID_EVENTS } from '../../../../Events/events';

export const ShipSelectionAndPlacementManager = ({
  model,
  view,
  componentEmitter,
  publisher,
  subscriptionManager
}) => {
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

  const emit = {
    initializeRequest: () => componentEmitter.publish(SHIP_EVENTS.SELECTION.INITIALIZE_REQUESTED),
    containerCreated: ({ data }) => {
      componentEmitter.publish(SHIP_EVENTS.PLACEMENT.CONTAINER_RECEIVED, data);
      publisher.scoped.noFulfill(SHIP_EVENTS.PLACEMENT.CONTAINER_RECEIVED);
    },
    placementCoordinatesReceived: ({ data }) =>
      componentEmitter.publish(SHIP_EVENTS.PLACEMENT.PLACEMENT_COORDINATES_RECEIVED, data),
    selectRequest: () => {
      componentEmitter.publish(SHIP_EVENTS.SELECTION.SELECTION_REQUESTED);
      componentEmitter.publish(SHIP_EVENTS.PLACEMENT.ENABLE_PLACEMENT_REQUESTED);
      if (model.isPlaced()) componentEmitter.publish(SHIP_EVENTS.PLACEMENT.PICKUP_REQUESTED);
    },
    deselectRequest: () => {
      componentEmitter.publish(SHIP_EVENTS.SELECTION.DESELECT_REQUESTED);
      componentEmitter.publish(SHIP_EVENTS.PLACEMENT.DISABLE_PLACEMENT_REQUESTED);
    },
    end: () => {
      componentEmitter.publish(SHIP_EVENTS.SELECTION.OVER);
      componentEmitter.publish(SHIP_EVENTS.PLACEMENT.OVER);
    }
  };

  const onInitialize = () => {
    emit.initializeRequest();
    componentEmitter.subscribe(SHIP_EVENTS.SELECTION.SELECT_REQUEST_RECEIVED, onSelect);
    componentEmitter.subscribe(SHIP_EVENTS.SELECTION.DESELECT_REQUEST_RECEIVED, onDeselect);
    subscriptionManager.scoped.subscribe(
      MAIN_GRID_EVENTS.PLACEMENT.GRID_INITIALIZED,
      emit.containerCreated
    );
  };

  const onPlacementCoordinatesReceived = ({ data }) => {
    emit.placementCoordinatesReceived({ data });
    onDeselect();
  };
  const onSelect = () => {
    emit.selectRequest();
    subscriptionManager.scoped.subscribe(
      MAIN_GRID_EVENTS.PLACEMENT.ENTITY_PLACEMENT_PROCESSED,
      onPlacementCoordinatesReceived
    );
  };
  const onDeselect = () => {
    emit.deselectRequest();
    subscriptionManager.scoped.unsubscribe(
      MAIN_GRID_EVENTS.PLACEMENT.ENTITY_PLACEMENT_PROCESSED,
      onPlacementCoordinatesReceived
    );
  };

  const onEnd = () => {
    onDeselect();
    componentEmitter.unsubscribe(SHIP_EVENTS.SELECTION.SELECT_REQUEST_RECEIVED, onSelect);
    componentEmitter.unsubscribe(SHIP_EVENTS.SELECTION.DESELECT_REQUEST_RECEIVED, onDeselect);
    subscriptionManager.scoped.unsubscribe(
      MAIN_GRID_EVENTS.PLACEMENT.GRID_INITIALIZED,
      emit.containerCreated
    );
    emit.end();
  };

  return {
    initialize: () => onInitialize(),
    end: () => onEnd()
  };
};
