export const GAME_EVENTS = {
  STATE_CHANGED: 'stateChanged',
  TURN_ENDED: 'turnEnded',
  PLAYER_SWITCHED: 'playerSwitched',
  RESTARTED: 'gameRestarted', // any to start
  SETTINGS_SUBMITTED: 'settingsSubmitted', // none to start
  PLAYER_FINALIZED_PLACEMENT: 'playerFinalizedPlacement',
  ALL_PLAYERS_INITIALIZED: 'allPlayersInitialized', // start to placement
  ALL_PLACEMENTS_FINALIZED: 'allPlacementsFinalized', // placement to progress
  ATTACK_PROCESSED: 'playerAttackProcessed',
  PLAYER_END_TURN_REQUESTED: 'playerEndTurnRequested',
  ALL_PLAYER_SHIPS_SUNK: 'allPlayerShipsSunk', // progress to over
  PLAYER_TURN: 'playerTurn'
};
