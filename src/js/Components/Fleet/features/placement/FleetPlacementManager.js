import { EventEmitter } from '../../../../Events/core/EventEmitter';
import { FLEET_EVENTS } from '../../common/fleetEvents';

export const FleetPlacementManager = ({ shipControllers, componentEmitter }) => {
  const emitter = EventEmitter();
  const handleSelectShip = ({ data }) => {
    console.log(data);
    const { id } = data;
    shipControllers.forEach((controller) => {
      console.log(controller.properties.isSelected());
      if (controller.properties.getID() === id) controller.placement.requestSelect();
      else if (controller.properties.isSelected()) controller.placement.requestDeselect();
      emitter.publish(FLEET_EVENTS.PLACEMENT.DECLARE.SELECTED, data);
    });
  };

  const handleInitialize = (container) => {
    shipControllers.forEach((controller) => controller.placement.requestInitialize(container));
    shipControllers.forEach((controller) =>
      controller.placement.onSelected({ data: handleSelectShip })
    );
    componentEmitter.unsubscribe(FLEET_EVENTS.PLACEMENT.REQUEST.INITIALIZE, handleInitialize);
  };
  const handleEnd = () => {
    emitter.reset();
    componentEmitter.unsubscribeMany(COMPONENT_SUBSCRIPTIONS);
  };

  const onOrientationToggled = (callback) =>
    shipControllers.forEach((controller) => controller.placement.onOrientationToggled(callback));

  const offOrientationToggled = (callback) =>
    shipControllers.forEach((controller) => controller.placement.offOrientationToggled(callback));

  const onSelect = ({ data }) => {
    console.log(data);
    emitter.subscribe(FLEET_EVENTS.PLACEMENT.DECLARE.SELECTED, data);
  };
  const offSelect = (callback) =>
    emitter.unsubscribe(FLEET_EVENTS.PLACEMENT.DECLARE.SELECTED, callback);

  const COMPONENT_SUBSCRIPTIONS = [
    { event: FLEET_EVENTS.PLACEMENT.REQUEST.SELECT, callback: handleSelectShip },
    { event: FLEET_EVENTS.PLACEMENT.REQUEST.SUB_SELECTED, callback: onSelect },
    { event: FLEET_EVENTS.PLACEMENT.REQUEST.UNSUB_SELECTED, callback: offSelect },
    {
      event: FLEET_EVENTS.PLACEMENT.REQUEST.SUB_ORIENTATION_TOGGLE,
      callback: onOrientationToggled
    },
    {
      event: FLEET_EVENTS.PLACEMENT.REQUEST.UNSUB_ORIENTATION_TOGGLE,
      callback: offOrientationToggled
    },
    { event: FLEET_EVENTS.PLACEMENT.REQUEST.END, callback: handleEnd }
  ];

  componentEmitter.subscribe(FLEET_EVENTS.PLACEMENT.REQUEST.INITIALIZE, handleInitialize);
};
