import eventEmitter from '../../../utility/eventEmitter';

import { PLACEMENT_EVENTS } from '../../../utility/constants/events';

export const publish = {
  shipSelected: (shipElement, id, orientation) => {
    eventEmitter.publish(PLACEMENT_EVENTS.SHIP.SELECTED, {
      element: shipElement,
      length,
      id,
      orientation
    });
  },
  orientationToggled: (id, orientation) => {
    eventEmitter.publish(PLACEMENT_EVENTS.SHIP.ORIENTATION_CHANGED, { id, orientation });
  },
  placementSuccessful: () => eventEmitter.publish('shipPlacementSuccessful'),
  shipHit: (id) => eventEmitter.publish('shipHit', { id }),
  shipSunk: (id) => eventEmitter.publish('shipSunk', { id })
};
