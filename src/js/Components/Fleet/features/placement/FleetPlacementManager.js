import { EventEmitter } from '../../../../Events/core/EventEmitter';
import { FLEET_PLACEMENT_EVENTS } from '../../common/fleetEvents';

export const FleetPlacementManager = (placementControllers, componentEmitter, isAllShipsPlaced) => {
  const emitter = EventEmitter();
  const selected = { ship: null };

  console.log(placementControllers);

  const handleInitialize = () => {
    componentEmitter.subscribeMany(COMPONENT_SUBSCRIPTIONS);
    placementControllers.forEach((controller) => controller.initialize());
    placementControllers.forEach((controller) => controller.onSelected(handleSelectShip));
    componentEmitter.unsubscribe(FLEET_PLACEMENT_EVENTS.INITIALIZE, handleInitialize);
  };
  const handleEnd = () => {
    placementControllers.forEach((controller) => controller.end());
    emitter.reset();
    componentEmitter.unsubscribeMany(COMPONENT_SUBSCRIPTIONS);
  };

  const onOrientationToggled = ({ data }) =>
    placementControllers.forEach((controller) => controller.onOrientationToggled(data));
  const offOrientationToggled = ({ data }) =>
    placementControllers.forEach((controller) => controller.offOrientationToggled(data));

  const handleSelectShip = ({ data }) => {
    const { id } = data;
    placementControllers.forEach((controller, key) => {
      if (key === id) {
        data.rotateButton = controller.getRotateButton();
        emitter.publish(FLEET_PLACEMENT_EVENTS.SELECTED, data);
        emitter.publish(FLEET_PLACEMENT_EVENTS.SHIP_NO_LONGER_PLACED, data);
        controller.select();
        selected.ship = controller;
      } else if (controller.isSelected()) controller.deselect();
    });
  };
  const onSelect = ({ data }) => emitter.subscribe(FLEET_PLACEMENT_EVENTS.SELECTED, data);
  const offSelect = ({ data }) => emitter.unsubscribe(FLEET_PLACEMENT_EVENTS.SELECTED, data);

  const handleSetCoordinates = ({ data }) => {
    selected.ship.setCoordinates(data);
    if (isAllShipsPlaced()) emitter.publish(FLEET_PLACEMENT_EVENTS.ALL_SHIPS_PLACED);
  };
  const onAllShipsPlaced = ({ data }) =>
    emitter.subscribe(FLEET_PLACEMENT_EVENTS.ALL_SHIPS_PLACED, data);
  const offAllShipsPlaced = ({ data }) =>
    emitter.unsubscribe(FLEET_PLACEMENT_EVENTS.ALL_SHIPS_PLACED, data);

  const onShipNoLongerPlaced = ({ data }) =>
    emitter.subscribe(FLEET_PLACEMENT_EVENTS.SHIP_NO_LONGER_PLACED, data);
  const offShipNoLongerPlaced = ({ data }) =>
    emitter.unsubscribe(FLEET_PLACEMENT_EVENTS.SHIP_NO_LONGER_PLACED, data);

  const COMPONENT_SUBSCRIPTIONS = [
    { event: FLEET_PLACEMENT_EVENTS.SELECT, callback: handleSelectShip },
    {
      event: FLEET_PLACEMENT_EVENTS.SET_COORDINATES,
      callback: handleSetCoordinates
    },
    { event: FLEET_PLACEMENT_EVENTS.SUB_SELECTED, callback: onSelect },
    { event: FLEET_PLACEMENT_EVENTS.UNSUB_SELECTED, callback: offSelect },
    {
      event: FLEET_PLACEMENT_EVENTS.SUB_ORIENTATION_TOGGLED,
      callback: onOrientationToggled
    },
    {
      event: FLEET_PLACEMENT_EVENTS.UNSUB_ORIENTATION_TOGGLED,
      callback: offOrientationToggled
    },
    {
      event: FLEET_PLACEMENT_EVENTS.SUB_ALL_SHIPS_PLACED,
      callback: onAllShipsPlaced
    },
    {
      event: FLEET_PLACEMENT_EVENTS.UNSUB_ALL_SHIPS_PLACED,
      callback: offAllShipsPlaced
    },
    {
      event: FLEET_PLACEMENT_EVENTS.SUB_SHIP_NO_LONGER_PLACED,
      callback: onShipNoLongerPlaced
    },
    {
      event: FLEET_PLACEMENT_EVENTS.UNSUB_SHIP_NO_LONGER_PLACED,
      callback: offShipNoLongerPlaced
    },
    { event: FLEET_PLACEMENT_EVENTS.END, callback: handleEnd }
  ];

  componentEmitter.subscribe(FLEET_PLACEMENT_EVENTS.INITIALIZE, handleInitialize);
};
