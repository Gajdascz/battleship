import eventEmitter from '../../../utility/eventEmitter';
import {
  COMMON_EVENTS,
  PLACEMENT_EVENTS,
  PROGRESS_EVENTS
} from '../../../utility/constants/events';

export const publish = {
  common: {
    stateTransitioned: (state, callback) =>
      eventEmitter.publish(COMMON_EVENTS.STATE_TRANSITIONED, {
        state,
        callback
      }),
    playerSwitched: () => eventEmitter.publish(COMMON_EVENTS.PLAYER_SWITCHED),
    turnConcluded: () => eventEmitter.publish(COMMON_EVENTS.TURN_CONCLUDED)
  },
  start: {
    gameStarted: () => eventEmitter.publish(COMMON_EVENTS.GAME_STARTED)
  },
  placement: {
    placementState: () => eventEmitter.publish(PLACEMENT_EVENTS.STATE),
    placementsProcessed: () => eventEmitter.publish(PLACEMENT_EVENTS.PROCESSED)
  },
  progress: {
    progressState: () => eventEmitter.publish(PROGRESS_EVENTS.STATE),
    playerSwitched: (currentPlayer) =>
      eventEmitter.publish(PROGRESS_EVENTS.PLAYER_SWITCHED, { currentPlayer }),
    attackInitiated: () => eventEmitter.publish(PROGRESS_EVENTS.ATTACK.INITIATED),
    attackProcessed: () => eventEmitter.publish(PROGRESS_EVENTS.ATTACK.PROCESSED)
  },
  over: {
    gameEnded: () => eventEmitter.publish(COMMON_EVENTS.GAME_ENDED)
  }
};
