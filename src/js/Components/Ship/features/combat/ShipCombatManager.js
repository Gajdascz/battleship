import { STATUSES } from '../../../../Utility/constants/common';
import { BOOL } from '../../../../Utility/constants/dom/attributes';
import { SHIP_DATA_ATTRIBUTES } from '../../common/shipConstants';
import { SHIP_COMBAT_EVENTS } from '../../common/shipEvents';

export const ShipCombatManager = ({ model, view, emitter }) => {
  const handleSunk = () => {
    view.elements.getMainShip().dataset[SHIP_DATA_ATTRIBUTES.SHIP_SUNK] = BOOL.T;
    view.elements.getTrackingShip().dataset[SHIP_DATA_ATTRIBUTES.SHIP_SUNK] = BOOL.T;
  };

  const handleHit = () => {
    const result = model.hit();
    if (result === STATUSES.SHIP_SUNK) handleSunk();
    return result;
  };

  const hitHandler = emitter.createHandler(SHIP_COMBAT_EVENTS.HIT_PROCESSED, handleHit);

  return {
    hit: () => hitHandler.emit(),
    onHit: (callback) => hitHandler.on(callback),
    offHit: (callback) => hitHandler.off(callback),
    end: () => hitHandler.reset()
  };
};
