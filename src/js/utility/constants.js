const LETTER_AXES = {
  ROW: 'row',
  COL: 'col'
};

const STATES = {
  PLACEMENT: 'placement',
  PROGRESS: 'progress',
  OVER: 'over'
};

const PLAYERS = {
  IDS: {
    P1: 'playerOne',
    P2: 'playerTwo'
  }
};

const RESULTS = {
  MISS: false,
  HIT: true,
  SHIP_SUNK: 1,
  ALL_SHIPS_SUNK: -1,
  UNEXPLORED: null
};

const DIRECTIONS = {
  UP: [-1, 0],
  RIGHT: [0, 1],
  DOWN: [1, 0],
  LEFT: [0, -1]
};

const ORIENTATIONS = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal'
};

const EVENTS = {
  SELECTED: 'shipSelected',
  ORIENTATION_CHANGED: 'shipOrientationChanged',
  PLACED: 'shipPlaced',
  PLACED_SUCCESS: 'shipPlacementSuccessful',
  PLACEMENTS_SUBMITTED: 'placementsSubmitted',
  PLAYER_ATTACKED: 'playerAttacked',
  TURN_CONCLUDED: 'turnConcluded',
  RESTART: 'gameRestarted',
  PLAYER_SWITCHED: 'playerSwitched',
  GAME_STARTED: 'gameStarted',
  STATE_TRANSITIONED: 'stateTransitioned',
  PLACEMENT_STATE: 'gamePlacementState',
  PROGRESS_STATE: 'gameInProgressState',
  OVER_STATE: 'gameOverState',
  ATTACK_PROCESSED: 'attackProcessed',
  PLACEMENTS_PROCESSED: 'placementsProcessed',
  SHIP_HIT: 'shipHit',
  SHIP_SUNK: 'shipSunk'
};

export { LETTER_AXES, STATES, PLAYERS, RESULTS, ORIENTATIONS, DIRECTIONS, EVENTS };
