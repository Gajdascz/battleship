// Ship Component
import { SHIP_EVENTS } from '../../common/shipEvents';
import { ShipSelectionController } from './selection/ShipSelectionController';
import { ShipPlacementController } from './placement/ShipPlacementController';

export const ShipSelectionAndPlacementManager = ({ model, view, componentEmitter }) => {
  ShipSelectionController({
    model,
    view,
    componentEmitter
  });
  ShipPlacementController({
    model,
    view,
    componentEmitter
  });

  const emit = {
    initializeRequest: (container) => {
      componentEmitter.publish(SHIP_EVENTS.SELECTION.INITIALIZE_REQUESTED);
      componentEmitter.publish(SHIP_EVENTS.PLACEMENT.INITIALIZE_REQUESTED, { container });
    },
    placementCoordinatesReceived: ({ data }) =>
      componentEmitter.publish(SHIP_EVENTS.PLACEMENT.PLACEMENT_COORDINATES_RECEIVED, { data }),
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
      componentEmitter.publish(SHIP_EVENTS.SELECTION.END_REQUESTED);
      componentEmitter.publish(SHIP_EVENTS.PLACEMENT.END_REQUESTED);
    }
  };

  const onInitialize = ({ data }) => {
    const { container } = data;
    console.log(container);
    emit.initializeRequest(container);
    componentEmitter.subscribe(SHIP_EVENTS.SELECTION.SELECT_REQUEST_RECEIVED, onSelect);
    componentEmitter.subscribe(SHIP_EVENTS.SELECTION.DESELECT_REQUEST_RECEIVED, onDeselect);
    componentEmitter.subscribe(SHIP_EVENTS.SELECTION_PLACEMENT.END_REQUESTED, onEnd);
  };

  const onPlacementCoordinatesReceived = ({ data }) => {
    emit.placementCoordinatesReceived({ data });
    onDeselect();
  };
  const onSelect = () => {
    emit.selectRequest();
    componentEmitter.subscribe(
      SHIP_EVENTS.PLACEMENT.PLACEMENT_COORDINATES_RECEIVED,
      onPlacementCoordinatesReceived
    );
  };
  const onDeselect = () => {
    emit.deselectRequest();
    componentEmitter.unsubscribe(
      SHIP_EVENTS.PLACEMENT.PLACEMENT_COORDINATES_RECEIVED,
      onPlacementCoordinatesReceived
    );
  };

  const onEnd = () => {
    onDeselect();
    componentEmitter.unsubscribe(SHIP_EVENTS.SELECTION.SELECT_REQUEST_RECEIVED, onSelect);
    componentEmitter.unsubscribe(SHIP_EVENTS.SELECTION.DESELECT_REQUEST_RECEIVED, onDeselect);
    componentEmitter.unsubscribe(SHIP_EVENTS.SELECTION_PLACEMENT.END_REQUESTED, onEnd);
    emit.end();
  };

  componentEmitter.subscribe(SHIP_EVENTS.SELECTION_PLACEMENT.INITIALIZE_REQUESTED, onInitialize);
};
