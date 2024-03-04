import { SHIP_SELECTION_EVENTS, SHIP_PLACEMENT_EVENTS } from '../../common/shipEvents';
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

  const handleInitialize = () => {
    componentEmitter.unsubscribe(SHIP_SELECTION_EVENTS.INITIALIZE, handleInitialize);
    componentEmitter.subscribeMany(COMPONENT_SUBSCRIPTIONS);
    selectionController.initialize(handleSelect, handleOrientationToggle);
  };

  const handlePlace = ({ data }) => {
    placementController.place(data);
    handleDeselect();
  };

  const handleSelect = () => {
    if (model.isPlaced()) placementController.pickup();
    selectionController.select();
    emitter.publish(SHIP_SELECTION_EVENTS.SELECTED, {
      id: model.getID(),
      length: model.getLength(),
      orientation: model.getOrientation()
    });
  };
  const handleOrientationToggle = () => {
    emitter.publish(SHIP_SELECTION_EVENTS.ORIENTATION_TOGGLED, model.getOrientation());
  };
  const handleDeselect = () => selectionController.deselect();

  const handleEnd = () => {
    selectionController.end();
    emitter.reset();
    componentEmitter.unsubscribeMany(COMPONENT_SUBSCRIPTIONS);
  };

  const onSelect = ({ data }) => emitter.subscribe(SHIP_SELECTION_EVENTS.SELECTED, data);

  const offSelect = ({ data }) => emitter.unsubscribe(SHIP_SELECTION_EVENTS.DESELECTED, data);
  const onOrientationToggled = ({ data }) =>
    emitter.subscribe(SHIP_SELECTION_EVENTS.ORIENTATION_TOGGLED, data);
  const offOrientationToggled = ({ data }) =>
    emitter.unsubscribe(SHIP_SELECTION_EVENTS.ORIENTATION_TOGGLED, data);

  const COMPONENT_SUBSCRIPTIONS = [
    { event: SHIP_SELECTION_EVENTS.DESELECT, callback: handleDeselect },
    { event: SHIP_PLACEMENT_EVENTS.SET_COORDINATES, callback: handlePlace },
    { event: SHIP_SELECTION_EVENTS.SUB_SELECTED, callback: onSelect },
    { event: SHIP_SELECTION_EVENTS.UNSUB_SELECTED, callback: offSelect },
    {
      event: SHIP_SELECTION_EVENTS.SUB_ORIENTATION_TOGGLED,
      callback: onOrientationToggled
    },
    {
      event: SHIP_SELECTION_EVENTS.UNSUB_ORIENTATION_TOGGLED,
      callback: offOrientationToggled
    },

    { event: SHIP_PLACEMENT_EVENTS.END, callback: handleEnd }
  ];

  componentEmitter.subscribe(SHIP_PLACEMENT_EVENTS.INITIALIZE, handleInitialize);
};
