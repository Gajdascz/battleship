import { PLACEMENT_EVENTS } from '../../../utility/constants/events';
import eventEmitter from '../../../utility/eventEmitter';
export const publish = {
  shipPlaced: ({ placedCoordinates, id }) => {
    eventEmitter.publish(PLACEMENT_EVENTS.SHIP.PLACED, {
      id,
      placedCoordinates
    });
  }
};
