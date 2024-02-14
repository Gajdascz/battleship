import { PLACEMENT_EVENTS } from '../../../utility/constants/events';
import eventEmitter from '../../../utility/eventEmitter';

export const publish = {
  selectRequested: ({ id }) => eventEmitter.publish(PLACEMENT_EVENTS.SHIP.SELECT_REQUESTED, { id }),
  shipSelected: ({ length, id, orientation }) => {
    eventEmitter.publish(PLACEMENT_EVENTS.SHIP.SELECTED, {
      id,
      length,
      orientation
    });
  },
  orientationToggled: ({ orientation }) => {
    eventEmitter.publish(PLACEMENT_EVENTS.SHIP.ORIENTATION_CHANGED, {
      orientation
    });
  },
  placementRequested: ({ id, length }) =>
    eventEmitter.publish(PLACEMENT_EVENTS.SHIP.PLACEMENT_REQUESTED, { id, length })
};
