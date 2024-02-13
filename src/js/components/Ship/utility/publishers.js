import { MOUSE_EVENTS, PLACEMENT_EVENTS, PROGRESS_EVENTS } from '../../../utility/constants/events';
import eventEmitter from '../../../utility/eventEmitter';

export const publish = {
  shipSelected: ({ length, id, orientation }) => {
    eventEmitter.publish(PLACEMENT_EVENTS.SHIP.SELECTED, {
      id,
      length,
      orientation
    });
  },
  orientationToggled: ({ length, orientation }) => {
    eventEmitter.publish(PLACEMENT_EVENTS.SHIP.ORIENTATION_CHANGED, {
      length,
      orientation
    });
  }
};
