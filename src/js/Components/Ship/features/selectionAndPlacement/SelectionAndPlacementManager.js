import { SHIP_EVENTS } from '../../common/shipEvents';
import { ShipSelectionController } from './selection/ShipSelectionController';
import { ShipPlacementController } from './placement/ShipPlacementController';
import { EventEmitter } from '../../../../Events/core/EventEmitter';
export const ShipSelectionAndPlacementManager = ({ model, view, componentEmitter }) => {
  const emitter = EventEmitter();
  const selectionController = ShipSelectionController({
    model,
    view
  });
  const placementController = ShipPlacementController({
    model,
    view
  });

  const handleInitialize = ({ data }) => {
    console.log(data);
    const { container } = data;
    console.log(container);
    componentEmitter.unsubscribe(
      SHIP_EVENTS.SELECTION_PLACEMENT.INITIALIZE_REQUESTED,
      handleInitialize
    );
    componentEmitter.subscribeMany(COMPONENT_SUBSCRIPTIONS);
    selectionController.initialize(handleSelect);
    placementController.initialize(container);
  };

  const handlePlace = ({ data }) => {
    const { coordinates } = data;
    placementController.place(coordinates);
    handleDeselect();
  };

  const handleSelect = () => {
    if (model.isPlaced()) placementController.pickup();
    selectionController.select();
    placementController.enable();
    emitter.publish(SHIP_EVENTS.SELECTION.DECLARE.SELECTED, {
      id: model.getID(),
      length: model.getLength()
    });
  };
  const handleDeselect = () => {
    selectionController.deselect();
    placementController.disable();
  };

  const handleEnd = () => {
    selectionController.end();
    placementController.end();
    emitter.reset();
    componentEmitter.unsubscribeMany(COMPONENT_SUBSCRIPTIONS);
  };

  const onSelect = ({ data }) => {
    const { callback } = data;
    emitter.subscribe(SHIP_EVENTS.SELECTION.DECLARE.SELECTED, callback);
  };
  const offSelect = ({ data }) => {
    const { callback } = data;
    emitter.unsubscribe(SHIP_EVENTS.SELECTION.DECLARE.DESELECTED, callback);
  };
  const onOrientationToggled = ({ data }) => {
    const { callback } = data;
    emitter.subscribe(SHIP_EVENTS.SELECTION.DECLARE.ORIENTATION_TOGGLED, callback);
  };
  const offOrientationToggled = ({ data }) => {
    const { callback } = data;
    emitter.unsubscribe(SHIP_EVENTS.SELECTION.DECLARE.ORIENTATION_TOGGLED, callback);
  };

  const COMPONENT_SUBSCRIPTIONS = [
    { event: SHIP_EVENTS.SELECTION.REQUEST.DESELECT, callback: handleDeselect },
    { event: SHIP_EVENTS.PLACEMENT.REQUEST.SET_COORDINATES, callback: handlePlace },
    { event: SHIP_EVENTS.SELECTION.REQUEST.SUB_SELECTED, callback: onSelect },
    { event: SHIP_EVENTS.SELECTION.REQUEST.UNSUB_SELECTED, callback: offSelect },
    {
      event: SHIP_EVENTS.SELECTION.REQUEST.SUB_ORIENTATION_TOGGLED,
      callback: onOrientationToggled
    },
    {
      event: SHIP_EVENTS.SELECTION.REQUEST.UNSUB_ORIENTATION_TOGGLED,
      callback: offOrientationToggled
    },

    { event: SHIP_EVENTS.SELECTION_PLACEMENT.END_REQUESTED, callback: handleEnd }
  ];

  componentEmitter.subscribe(
    SHIP_EVENTS.SELECTION_PLACEMENT.INITIALIZE_REQUESTED,
    handleInitialize
  );
};
// const emit = {
//   initializeRequest: (container) => {
//     componentEmitter.publish(SHIP_EVENTS.SELECTION.INITIALIZE_REQUESTED);
//     componentEmitter.publish(SHIP_EVENTS.PLACEMENT.INITIALIZE_REQUESTED, { container });
//   },
//   placementCoordinatesReceived: ({ data }) =>
//     componentEmitter.publish(SHIP_EVENTS.PLACEMENT.PLACEMENT_COORDINATES_RECEIVED, { data }),
//   selectRequest: () => {
//     componentEmitter.publish(SHIP_EVENTS.SELECTION.SELECTION_REQUESTED);
//     componentEmitter.publish(SHIP_EVENTS.PLACEMENT.ENABLE_PLACEMENT_REQUESTED);
//     if (model.isPlaced()) componentEmitter.publish(SHIP_EVENTS.PLACEMENT.PICKUP_REQUESTED);
//   },
//   deselectRequest: () => {
//     componentEmitter.publish(SHIP_EVENTS.SELECTION.DESELECT_REQUESTED);
//     componentEmitter.publish(SHIP_EVENTS.PLACEMENT.DISABLE_PLACEMENT_REQUESTED);
//   },
//   end: () => {
//     componentEmitter.publish(SHIP_EVENTS.SELECTION.END_REQUESTED);
//     componentEmitter.publish(SHIP_EVENTS.PLACEMENT.END_REQUESTED);
//   }
// };
// const onInitialize = ({ data }) => {
//   const { container } = data;
//   console.log(container);
//   emit.initializeRequest(container);
//   componentEmitter.subscribe(SHIP_EVENTS.SELECTION.SELECT_REQUEST_RECEIVED, onSelect);
//   componentEmitter.subscribe(SHIP_EVENTS.SELECTION.DESELECT_REQUEST_RECEIVED, onDeselect);
//   componentEmitter.subscribe(SHIP_EVENTS.SELECTION_PLACEMENT.END_REQUESTED, onEnd);
// };

// const onPlacementCoordinatesReceived = ({ data }) => {
//   emit.placementCoordinatesReceived({ data });
//   onDeselect();
// };
// const onSelect = () => {
//   emit.selectRequest();
//   componentEmitter.subscribe(
//     SHIP_EVENTS.PLACEMENT.PLACEMENT_COORDINATES_RECEIVED,
//     onPlacementCoordinatesReceived
//   );
// };
// const onDeselect = () => {
//   emit.deselectRequest();
//   componentEmitter.unsubscribe(
//     SHIP_EVENTS.PLACEMENT.PLACEMENT_COORDINATES_RECEIVED,
//     onPlacementCoordinatesReceived
//   );
// };

// const onEnd = () => {
//   onDeselect();
//   componentEmitter.unsubscribe(SHIP_EVENTS.SELECTION.SELECT_REQUEST_RECEIVED, onSelect);
//   componentEmitter.unsubscribe(SHIP_EVENTS.SELECTION.DESELECT_REQUEST_RECEIVED, onDeselect);
//   componentEmitter.unsubscribe(SHIP_EVENTS.SELECTION_PLACEMENT.END_REQUESTED, onEnd);
//   emit.end();
// };
