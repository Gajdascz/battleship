import { PLACEMENT_EVENTS } from '../../../utility/constants/events';
import eventEmitter from '../../../utility/eventEmitter';
import { handle } from './controllerHandlers';

export const subscribe = {
  shipSelected: (callback) =>
    eventEmitter.subscribe(PLACEMENT_EVENTS.SHIP.SELECTED, (detail) =>
      handle.placementState.shipSelect(detail, callback)
    )
};
