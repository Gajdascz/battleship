import { STATES } from './common';

export const GENERAL_EVENTS = {
  GAME_STARTED: STATES.START,
  GAME_ENDED: STATES.OVER,
  STATE_TRANSITIONED: 'stateTransitioned',
  RESTARTED: 'gameRestarted',
  SETTINGS_SUBMITTED: 'settingsSubmitted'
};

export const PLACEMENT_EVENTS = {
  STATE: STATES.PLACEMENT,
  SUBMITTED: 'placementsSubmitted',
  PROCESSED: 'placementsProcessed',
  SHIP: {
    SELECTED: 'shipSelected',
    ORIENTATION_CHANGED: 'shipOrientationChanged',
    PLACED: 'shipPlaced',
    PLACED_SUCCESS: 'shipPlacementSuccessful'
  }
};

export const PROGRESS_EVENTS = {
  PROGRESS_STATE: STATES.PROGRESS,
  TURN_CONCLUDED: 'turnConcluded',
  PLAYER_SWITCHED: 'playerSwitched',
  ATTACK: {
    PROCESSED: 'attackProcessed',
    INITIATED: 'playerAttacked',
    SHIP_HIT: 'shipHit',
    SHIP_SUNK: 'shipSunk'
  }
};
