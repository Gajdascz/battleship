import { ShipPlacementView } from './ShipPlacementView';

export const ShipPlacementController = ({ model, view }) => {
  const placementView = ShipPlacementView(view.elements.getMainShip());
  let isInitialized = false;
  let isEnabled = false;

  const place = (coordinates) => {
    model.setPlacedCoordinates(coordinates);
    model.setIsPlaced(true);
    placementView.update.placementStatus(true);
  };
  const pickup = () => {
    model.clearPlacedCoordinates();
    model.setIsPlaced(false);
    placementView.update.placementStatus(false);
  };
  const initialize = (placementContainer, requestPlacementCallback) => {
    if (isInitialized) return;
    placementView.initialize({
      placementContainer,
      requestPlacementCallback: () => {} // placeholder
    });
  };
  const end = () => {
    if (!isInitialized) return;
    disable();
    placementView.end();
    isInitialized = false;
  };
  const enable = () => {
    if (isEnabled) return;
    placementView.enable.request();
  };
  const disable = () => {
    if (!isEnabled) return;
    placementView.disable.request();
    isEnabled = false;
  };

  return {
    initialize,
    end,
    place,
    pickup,
    enable,
    disable
  };
};

// componentEmitter.subscribe(SHIP_EVENTS.PLACEMENT.INITIALIZE_REQUESTED, initialize);
// const execute = {
//   place: ({ data }) => {
//     const { placedCoordinates } = data;
//     model.setPlacedCoordinates(placedCoordinates);
//     model.setIsPlaced(true);
//     placementView.update.placementStatus(true);
//     emit.placementSet();
//   },
//   pickup: () => {
//     model.clearPlacedCoordinates();
//     model.setIsPlaced(false);
//     placementView.update.placementStatus(false);
//   }
// };

// const emit = {
//   placementSet: () => {
//     componentEmitter.publish(SHIP_EVENTS.PLACEMENT.SET, { scopedID: model.getScopedID() });
//   },
//   requestPlacement: () => {
//     componentEmitter.publish(SHIP_EVENTS.PLACEMENT.REQUESTED, {
//       id: model.getID(),
//       scopedID: model.getScopedID(),
//       length: model.getLength()
//     });
//   }
// };

// const stateManager = {
//   isInitialized: false,
//   isEnabled: false,
//   initialize: ({ data }) => {
//     if (isInitialized) return;
//     const { container } = data;
//     placementView.initialize({
//       placementContainer: container,
//       requestPlacementCallback: emit.requestPlacement
//     });
//     componentEmitter.subscribe(SHIP_EVENTS.PLACEMENT.ENABLE_PLACEMENT_REQUESTED, enable);
//     componentEmitter.subscribe(SHIP_EVENTS.PLACEMENT.DISABLE_PLACEMENT_REQUESTED, disable);
//     componentEmitter.subscribe(SHIP_EVENTS.PLACEMENT.OVER, end);
//     isInitialized = true;
//   },
//   enable: () => {
//     if (isEnabled) return;
//     placementView.enable.request();
//     componentEmitter.subscribe(
//       SHIP_EVENTS.PLACEMENT.PLACEMENT_COORDINATES_RECEIVED,
//       execute.place
//     );
//     componentEmitter.subscribe(SHIP_EVENTS.PLACEMENT.PICKUP_REQUESTED, execute.pickup);
//     isEnabled = true;
//   },
//   disable: () => {
//     if (!isEnabled) return;
//     componentEmitter.unsubscribe(SHIP_EVENTS.PLACEMENT.PICKUP_REQUESTED, execute.pickup);
//     componentEmitter.unsubscribe(
//       SHIP_EVENTS.PLACEMENT.PLACEMENT_COORDINATES_RECEIVED,
//       execute.place
//     );
//     placementView.disable.request();

//     placementView.disable.request();
//     isEnabled = false;
//   },
//   end: () => {
//     if (!isInitialized) return;
//     disable();
//     placementView.end();
//     isInitialized = false;
//   }
// };
