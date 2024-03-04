import { EventEmitter } from '../../../../Events/core/EventEmitter';
import { FLEET_PLACEMENT_EVENTS } from '../../common/fleetEvents';

export const FleetPlacementManager = ({ model, shipControllers, componentEmitter }) => {
  const emitter = EventEmitter();
  const selected = { ship: null };

  const handleInitialize = () => {
    componentEmitter.subscribeMany(COMPONENT_SUBSCRIPTIONS);
    shipControllers.forEach((controller) => controller.placement.initialize());
    shipControllers.forEach((controller) => controller.placement.onSelected(handleSelectShip));
    componentEmitter.unsubscribe(FLEET_PLACEMENT_EVENTS.INITIALIZE, handleInitialize);
  };
  const handleEnd = () => {
    shipControllers.forEach((controller) => controller.placement.end());
    emitter.reset();
    componentEmitter.unsubscribeMany(COMPONENT_SUBSCRIPTIONS);
  };

  const onOrientationToggled = ({ data }) =>
    shipControllers.forEach((controller) => controller.placement.onOrientationToggled(data));
  const offOrientationToggled = ({ data }) =>
    shipControllers.forEach((controller) => controller.placement.offOrientationToggled(data));

  const handleSelectShip = ({ data }) => {
    const { id } = data;
    shipControllers.forEach((controller) => {
      if (controller.properties.getID() === id) {
        emitter.publish(FLEET_PLACEMENT_EVENTS.SELECTED, data);
        emitter.publish(FLEET_PLACEMENT_EVENTS.SHIP_NO_LONGER_PLACED, data);
        controller.placement.select();
        selected.ship = controller;
      } else if (controller.properties.isSelected()) controller.placement.deselect();
    });
  };
  const onSelect = ({ data }) => emitter.subscribe(FLEET_PLACEMENT_EVENTS.SELECTED, data);
  const offSelect = ({ data }) => emitter.unsubscribe(FLEET_PLACEMENT_EVENTS.SELECTED, data);

  const handleSetCoordinates = ({ data }) => {
    selected.ship.placement.setCoordinates(data);
    if (model.isAllShipsPlaced()) emitter.publish(FLEET_PLACEMENT_EVENTS.ALL_SHIPS_PLACED);
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
