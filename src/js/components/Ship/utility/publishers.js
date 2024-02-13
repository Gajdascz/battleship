import { MOUSE_EVENTS, PLACEMENT_EVENTS, PROGRESS_EVENTS } from '../../../utility/constants/events';
import eventEmitter from '../../../utility/eventEmitter';

export const publish = {
  shipSelected: ({ element, length, id, orientation }) => {
    eventEmitter.publish(PLACEMENT_EVENTS.SHIP.SELECTED, {
      element,
      length,
      id,
      orientation
    });
  },
  orientationToggled: ({ id, orientation }) => {
    eventEmitter.publish(PLACEMENT_EVENTS.SHIP.ORIENTATION_CHANGED, {
      id,
      orientation
    });
  }
};
