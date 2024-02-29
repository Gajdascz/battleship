import stateManagerRegistry from '../../State/stateManagerRegistry';
import { globalEmitter } from '../../Events/core/globalEventEmitter';
import { GAME_EVENTS } from './common/gameEvents';
import { STATES } from '../../Utility/constants/common';

export const GameStateController = () => {
  const initialize = () => {
    stateManagerRegistry.initialize({ data: STATES.START });
    enable();
  };

  const enable = () =>
    globalEmitter.subscribe(GAME_EVENTS.STATE_CHANGED, stateManagerRegistry.transition);

  const disable = () =>
    globalEmitter.unsubscribe(GAME_EVENTS.STATE_CHANGED, stateManagerRegistry.transition);

  const publishStateTransition = (state) => {
    console.log(state);
    globalEmitter.publish(GAME_EVENTS.STATE_CHANGED, state);
  };
  const publishPlayerSwitched = () => globalEmitter.publish(GAME_EVENTS.PLAYER_SWITCHED);

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
    initialize,
    transition,
    enable,
    disable,
    publishPlayerSwitched
  };
};
