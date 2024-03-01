import { STATUSES } from '../../../../Utility/constants/common';
import { BOOL } from '../../../../Utility/constants/dom/attributes';
import { SHIP_DATA_ATTRIBUTES } from '../../common/shipConstants';
import { SHIP_EVENTS } from '../../common/shipEvents';

export const ShipCombatManager = ({ model, view, componentEmitter, publisher }) => {
  const emit = {
    shipHit: () => {
      publisher.scoped.noFulfill(SHIP_EVENTS.COMBAT.HIT_PROCESSED, { id: model.getScope() });
    },
    shipSunk: () => {
      publisher.scoped.noFulfill(SHIP_EVENTS.COMBAT.SUNK, { id: model.getScope() });
    }
  };

  const onInitialize = () => {
    componentEmitter.subscribe(SHIP_EVENTS.COMBAT.HIT_REQUEST_RECEIVED, onHit);
  };
  const onEnd = () => {
    componentEmitter.unsubscribe(SHIP_EVENTS.COMBAT.HIT_REQUEST_RECEIVED, onHit);
  };

  const onSunk = () => {
    view.elements.getMainShip().dataset[SHIP_DATA_ATTRIBUTES.SHIP_SUNK] = BOOL.T;
    emit.shipSunk();
  };

  const onHit = () => {
    const result = model.hit();
    if (result === STATUSES.SHIP_SUNK) onSunk();
    else emit.shipHit();
  };

  return {
    initialize: () => onInitialize(),
    end: () => onEnd(),
    hit: () => onHit()
  };
};
