import { STATUSES } from '../../../../Utility/constants/common';
import { BOOL } from '../../../../Utility/constants/dom/attributes';
import { SHIP_DATA_ATTRIBUTES } from '../../common/shipConstants';
import { SHIP_COMBAT_EVENTS } from '../../common/shipEvents';
import { EventEmitter } from '../../../../Events/core/EventEmitter';

export const ShipCombatManager = (model, view, componentEmitter) => {
  const emitter = EventEmitter();
  const handleInitialize = () => {
    componentEmitter.unsubscribe(SHIP_COMBAT_EVENTS.INITIALIZE, handleInitialize);
    componentEmitter.subscribeMany(subscriptions);
  };
  const handleEnd = () => {
    emitter.reset();
    componentEmitter.unsubscribeMany(subscriptions);
  };

  const handleSunk = () => {
    view.elements.getMainShip().dataset[SHIP_DATA_ATTRIBUTES.SHIP_SUNK] = BOOL.T;
    view.elements.getTrackingShip().dataset[SHIP_DATA_ATTRIBUTES.SHIP_SUNK] = BOOL.T;
    emitter.publish(SHIP_COMBAT_EVENTS.SUNK, model.getID());
  };

  const handleHit = () => {
    const result = model.hit();
    if (result === STATUSES.SHIP_SUNK) handleSunk();
    else emitter.publish(SHIP_COMBAT_EVENTS.HIT_PROCESSED);
  };

  const onHit = ({ data }) => emitter.subscribe(SHIP_COMBAT_EVENTS.HIT_PROCESSED, data);
  const offHit = ({ data }) => emitter.unsubscribe(SHIP_COMBAT_EVENTS.HIT_PROCESSED, data);

  const onSunk = ({ data }) => emitter.subscribe(SHIP_COMBAT_EVENTS.SUNK, data);
  const offSunk = ({ data }) => emitter.unsubscribe(SHIP_COMBAT_EVENTS.SUNK, data);

  const subscriptions = [
    { event: SHIP_COMBAT_EVENTS.HIT, callback: handleHit },
    { event: SHIP_COMBAT_EVENTS.SUB_HIT_PROCESSED, callback: onHit },
    { event: SHIP_COMBAT_EVENTS.UNSUB_HIT_PROCESSED, callback: offHit },
    { event: SHIP_COMBAT_EVENTS.SUB_SUNK, callback: onSunk },
    { event: SHIP_COMBAT_EVENTS.UNSUB_SUNK, callback: offSunk },
    { event: SHIP_COMBAT_EVENTS.END, callback: handleEnd }
  ];

  componentEmitter.subscribe(SHIP_COMBAT_EVENTS.INITIALIZE, handleInitialize);
};
