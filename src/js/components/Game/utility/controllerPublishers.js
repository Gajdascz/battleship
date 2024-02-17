import eventEmitter from '../../../utility/events/eventEmitter';
import { GAME_EVENTS, PLACEMENT_EVENTS, PROGRESS_EVENTS } from '../../../utility/constants/events';
import { STATES } from '../../../utility/constants/common';
export const publish = {
  common: {
    stateTransitioned: (state, callback) =>
      eventEmitter.publish(GAME_EVENTS.STATE_CHANGED, {
        state,
        callback
      }),
    playerSwitched: () => eventEmitter.publish(GAME_EVENTS.PLAYER_SWITCHED),
    turnConcluded: () => eventEmitter.publish(GAME_EVENTS.TURN_ENDED)
  },
  start: {
    gameStarted: () => eventEmitter.publish(STATES.START)
  },
  placement: {
    placementState: () => eventEmitter.publish(STATES.PLACEMENT),
    placementsProcessed: () => eventEmitter.publish(PLACEMENT_EVENTS.PLACEMENTS_PROCESSED)
  },
  progress: {
    progressState: () => eventEmitter.publish(STATES.PROGRESS),
    playerSwitched: (currentPlayer) =>
      eventEmitter.publish(GAME_EVENTS.PLAYER_SWITCHED, { currentPlayer }),
    attackInitiated: () => eventEmitter.publish(PROGRESS_EVENTS.ATTACK_INITIATED),
    attackProcessed: () => eventEmitter.publish(PROGRESS_EVENTS.ATTACK_PROCESSED)
  },
  over: {
    gameEnded: () => eventEmitter.publish(STATES.OVER)
  }
};
