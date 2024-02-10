import eventEmitter from '../../../utility/eventEmitter';

import { SHIP } from '../../../___ui/common/constants/shipConstants';

export const publish = {
  shipSelected: (shipElement, id, orientation) => {
    eventEmitter.publish(SHIP.EVENTS.SELECTED, {
      element: shipElement,
      length,
      id,
      orientation
    });
  },
  orientationToggled: (id, orientation) => {
    eventEmitter.publish(SHIP.EVENTS.ORIENTATION_CHANGED, { id, orientation });
  },
  placementSuccessful: () => eventEmitter.publish('shipPlacementSuccessful'),
  shipHit: (id) => eventEmitter.publish('shipHit', { id }),
  shipSunk: (id) => eventEmitter.publish('shipSunk', { id })
};
