import stateManagerRegistry from '../../../../utility/stateManagement/stateManagerRegistry';
import eventEmitter from '../../../../utility/events/eventEmitter';
import { GAME_EVENTS } from '../../../../utility/constants/events';
import { STATES } from '../../../../utility/constants/common';

export const initializeGameState = () => {
  eventEmitter.subscribe(GAME_EVENTS.STATE_CHANGED, stateManagerRegistry.transition);

  const publishStateTransition = (state) => eventEmitter.publish(GAME_EVENTS.STATE_CHANGED, state);

  const transition = () => {
    const state = stateManagerRegistry.getCurrentState();
    switch (state) {
      case null:
        publishStateTransition(STATES.START);
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
