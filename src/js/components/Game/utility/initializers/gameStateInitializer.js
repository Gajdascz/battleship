import stateManagerRegistry from '../../../../utility/stateManagement/stateManagerRegistry';
import eventEmitter from '../../../../utility/eventEmitter';
import { COMMON_EVENTS } from '../../../../utility/constants/events';
import { STATES } from '../../../../utility/constants/common';

export const initializeGameState = () => {
  eventEmitter.subscribe(COMMON_EVENTS.STATE_TRANSITIONED, stateManagerRegistry.transition);

  const publishStateTransition = (state) =>
    eventEmitter.publish(COMMON_EVENTS.STATE_TRANSITIONED, state);

  const transition = () => {
    const state = stateManagerRegistry.getCurrentState();
    switch (state) {
      case null:
        publishStateTransition(STATES.START);
        transition();
        break;
      case STATES.START:
        publishStateTransition(STATES.PLACEMENT);
        break;
      case STATES.PLACEMENT:
        publishStateTransition(STATES.PROGRESS);
        break;
      case STATES.PROGRESS:
        publishStateTransition(STATES.OVER);
        break;
      case STATES.OVER:
        break;
    }
  };

  return transition;
};
