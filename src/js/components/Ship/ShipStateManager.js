import { PLACEMENT_EVENTS, PROGRESS_EVENTS } from '../../utility/constants/events';
import eventEmitter from '../../utility/eventEmitter';

export const ShipStateManager = () => {
  const initiate = () => eventEmitter.subscribe(PLACEMENT_EVENTS.STATE, startPlacementState);

  const startPlacementState = () => {
    eventEmitter.subscribe(PLACEMENT_EVENTS.SHIP.PLACED, place);
    eventEmitter.subscribe(PROGRESS_EVENTS.STATE, startProgressState);
  };

  const startProgressState = () => {
    disableShipSelection();
    disableShipOrientationToggle();
    _view.getElement().disabled = true;
    eventEmitter.unsubscribe(PROGRESS_EVENTS.STATE, startProgressState);
    eventEmitter.unsubscribe(PLACEMENT_EVENTS.SHIP.PLACED, place);

    eventEmitter.subscribe(PROGRESS_EVENTS.ATTACK.INITIATED);
  };
};
