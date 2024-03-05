import { EventEmitter } from '../../../../Events/core/EventEmitter';
import { FLEET_COMBAT_EVENTS } from '../../common/fleetEvents';

export const FleetCombatManager = (combatControllers, componentEmitter, isAllShipsSunk) => {
  const emitter = EventEmitter();
  const processHit = ({ data }) => {
    const { id } = data;
    const ship = combatControllers.get(id);
    ship.hit();
    emitter.publish(FLEET_COMBAT_EVENTS.SHIP_HIT);
  };
  const handleSunk = ({ data }) => {
    emitter.publish(FLEET_COMBAT_EVENTS.SHIP_SUNK, data);
    if (isAllShipsSunk()) emitter.publish(FLEET_COMBAT_EVENTS.ALL_SHIPS_SUNK);
  };
  const handleInitialize = () => {
    componentEmitter.unsubscribe(FLEET_COMBAT_EVENTS.INITIALIZE, handleInitialize);
    componentEmitter.subscribeMany(subscriptions);
    combatControllers.forEach((controller) => {
      controller.initialize();
      controller.onShipSunk(handleSunk);
    });
  };
  const handleEnd = () => {
    componentEmitter.unsubscribeMany(subscriptions);
    combatControllers.forEach((controller) => controller.end());
    emitter.reset();
  };

  const onShipHit = ({ data }) => emitter.subscribe(FLEET_COMBAT_EVENTS.SHIP_HIT, data);
  const offShipHit = ({ data }) => emitter.unsubscribe(FLEET_COMBAT_EVENTS.SHIP_HIT, data);

  const onShipSunk = ({ data }) => emitter.subscribe(FLEET_COMBAT_EVENTS.SHIP_SUNK, data);
  const offShipSunk = ({ data }) => emitter.unsubscribe(FLEET_COMBAT_EVENTS.SHIP_SUNK, data);

  const onAllShipsSunk = ({ data }) => emitter.subscribe(FLEET_COMBAT_EVENTS.ALL_SHIPS_SUNK, data);
  const offAllShipsSunk = ({ data }) =>
    emitter.unsubscribe(FLEET_COMBAT_EVENTS.ALL_SHIPS_SUNK, data);

  const subscriptions = [
    { event: FLEET_COMBAT_EVENTS.HIT_SHIP, callback: processHit },
    { event: FLEET_COMBAT_EVENTS.SUB_SHIP_HIT, callback: onShipHit },
    { event: FLEET_COMBAT_EVENTS.UNSUB_SHIP_HIT, callback: offShipHit },
    { event: FLEET_COMBAT_EVENTS.SUB_SHIP_SUNK, callback: onShipSunk },
    { event: FLEET_COMBAT_EVENTS.UNSUB_SHIP_SUNK, callback: offShipSunk },
    { event: FLEET_COMBAT_EVENTS.SUB_ALL_SHIPS_SUNK, callback: onAllShipsSunk },
    { event: FLEET_COMBAT_EVENTS.UNSUB_ALL_SHIPS_SUNK, callback: offAllShipsSunk },
    { event: FLEET_COMBAT_EVENTS.END, callback: handleEnd }
  ];

  componentEmitter.subscribe(FLEET_COMBAT_EVENTS.INITIALIZE, handleInitialize);
};
