import stateManagerRegistry from '../../utility/stateManagement/stateManagerRegistry';
import eventEmitter from '../../utility/events/eventEmitter';
import { GAME_EVENTS, PLACEMENT_EVENTS } from '../../utility/constants/events';
import { STATES } from '../../utility/constants/common';

export const GameStateController = (startGameCallback) => {
  const initialize = () =>
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
        eventEmitter.subscribe(PLACEMENT_EVENTS.GRID_PLACEMENTS_FINALIZED, switchPlayersCallback);
        break;
      case STATES.PLACEMENT:
        publishStateTransition(STATES.PROGRESS);
        break;
      case STATES.PROGRESS:
        eventEmitter.unsubscribe(PLACEMENT_EVENTS.GRID_PLACEMENTS_FINALIZED, switchPlayersCallback);
        publishStateTransition(STATES.OVER);
        break;
      case STATES.OVER:
        break;
    }
  };

  eventEmitter.subscribe(GAME_EVENTS.SETTINGS_SUBMITTED, startGameCallback);
  return {
    transition,
    initialize
  };
};
