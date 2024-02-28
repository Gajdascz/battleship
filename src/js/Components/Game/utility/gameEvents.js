export const GAME_EVENTS = {
  STATE_CHANGED: 'stateChanged',
  TURN_ENDED: 'turnEnded',
  PLAYER_SWITCHED: 'playerSwitched',
  RESTARTED: 'gameRestarted', // any to start
  SETTINGS_SUBMITTED: 'settingsSubmitted', // none to start
  ALL_PLAYERS_INITIALIZED: 'allPlayersInitialized', // start to placement
  ALL_PLACEMENTS_FINALIZED: 'allPlacementsFinalized', // placement to progress
  ALL_PLAYER_SHIPS_SUNK: 'allPlayerShipsSunk', // progress to over
  ATTACK_SENT: 'playerAttackSent',
  ATTACK_PROCESSED: 'playerAttackProcessed'
};
