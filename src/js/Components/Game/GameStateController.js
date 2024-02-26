import stateManagerRegistry from '../../Utility/stateManagement/stateManagerRegistry';
import globalEmitter from '../../Events/core/globalEventEmitter';
import { GAME_EVENTS } from '../../Utility/constants/dom/domEvents';
import { STATES } from '../../Utility/constants/common';

export const GameStateController = () => {
  const enable = () =>
    eventEmitter.subscribe(GAME_EVENTS.STATE_CHANGED, stateManagerRegistry.transition);

  const disable = () =>
    eventEmitter.unsubscribe(GAME_EVENTS.STATE_CHANGED, stateManagerRegistry.transition);

  const publishStateTransition = (state) => eventEmitter.publish(GAME_EVENTS.STATE_CHANGED, state);
  const publishPlayerSwitched = () => eventEmitter.publish(GAME_EVENTS.PLAYER_SWITCHED);

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

  return {
    transition,
    enable,
    disable,
    publishPlayerSwitched
  };
};
