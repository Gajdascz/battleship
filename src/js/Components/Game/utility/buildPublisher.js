import { STATES } from '../../../Utility/constants/common';
import {
  GAME_EVENTS,
  PLACEMENT_EVENTS,
  PROGRESS_EVENTS
} from '../../../Utility/constants/dom/domEvents';
import { Publisher } from '../../../Utility/events/Publisher';

const PUBLISHER_KEYS = {
  REQUESTS: {},
  ACTIONS: {
    STATE_CHANGED: 'stateChanged',
    PLAYER_SWITCHED: 'playerSwitched',
    TURN_ENDED: 'turnEnded',
    GAME_STARTED: 'gameStarted',
    SETTINGS_SUBMITTED: 'settingsSubmitted',
    GAME_RESTARTED: 'gameRestarted',
    GAME_ENDED: 'gameEnded',
    PLACEMENT: {
      STATE_STARTED: 'placementStateStarted',
      PLACEMENTS_FINALIZED: 'playerPlacementsFinalized'
    },
    PROGRESS: {
      STATE_STARTED: 'progressStateStarted',
      ATTACK_INITIATED: 'attackInitiated',
      ATTACK_PROCESSED: 'attackProcessed'
    }
  }
};

export const buildPublisher = (scope) =>
  Publisher(scope, {
    predefinedRequests: [],
    predefinedActions: [
      { name: PUBLISHER_KEYS.ACTIONS.GAME_STARTED, event: STATES.START },
      { name: PUBLISHER_KEYS.ACTIONS.STATE_CHANGED, event: GAME_EVENTS.STATE_CHANGED },
      { name: PUBLISHER_KEYS.ACTIONS.PLAYER_SWITCHED, event: GAME_EVENTS.PLAYER_SWITCHED },
      { name: PUBLISHER_KEYS.ACTIONS.TURN_ENDED, event: GAME_EVENTS.TURN_ENDED },
      { name: PUBLISHER_KEYS.ACTIONS.SETTINGS_SUBMITTED, event: GAME_EVENTS.SETTINGS_SUBMITTED },
      { name: PUBLISHER_KEYS.ACTIONS.GAME_RESTARTED, event: GAME_EVENTS.GAME_RESTARTED },
      { name: PUBLISHER_KEYS.ACTIONS.PLACEMENT.STATE_STARTED, event: STATES.PLACEMENT },
      {
        name: PUBLISHER_KEYS.ACTIONS.PLACEMENT.PLACEMENTS_FINALIZED,
        event: PLACEMENT_EVENTS.GRID_PLACEMENTS_FINALIZED
      },
      { name: PUBLISHER_KEYS.ACTIONS.PROGRESS.STATE_STARTED, event: STATES.PROGRESS },
      {
        name: PUBLISHER_KEYS.ACTIONS.PROGRESS.ATTACK_INITIATED,
        event: PROGRESS_EVENTS.ATTACK_INITIATED
      },
      {
        name: PUBLISHER_KEYS.ACTIONS.PROGRESS.ATTACK_PROCESSED,
        event: PROGRESS_EVENTS.ATTACK_PROCESSED
      },
      { name: PUBLISHER_KEYS.ACTIONS.GAME_ENDED, event: STATES.OVER }
    ],
    predefinedKeys: PUBLISHER_KEYS
  });
