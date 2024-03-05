export const MAIN_GRID_PLACEMENT_EVENTS = {
  // Requests
  INITIALIZE: 'gridPlacementInitializeRequested', // Request initializing the grid placement controller
  SELECT: 'gridEntitySelected', // Entity related to grid has been selected
  PLACE: 'gridEntityPlacementRequested', // Entity is requesting placement on the grid
  UPDATE_ORIENTATION: 'gridEntityOrientationUpdated', // Orientation of selected entity has changed
  ENABLE_SUBMIT: 'gridEnableSubmissionRequest',
  DISABLE_SUBMIT: 'gridDisableSubmissionRequest',
  SUBMIT: 'gridPlacementsFinalizationRequested', // Player placement submission parsed for grid-placement
  END: 'gridPlacementEndRequested', // Grid placement state is over
  // Subscription Requests
  SUB_PLACED: 'gridPlacementProcessedSubscribe',
  UNSUB_PLACED: 'gridPlacementProcessedUnsubscribe',
  SUB_SUBMITTED: 'gridPlacementsFinalizedSubscribe',
  UNSUB_SUBMITTED: 'gridPlacementsFinalizedUnsubscribe',
  // Declarations
  PROCESSED_PLACED: 'gridPlacementProcessed', // Entity placed and accepted in grid
  SUBMITTED: 'gridPlacementsFinalized' // Placements have been processed and finalized
};

export const MAIN_GRID_COMBAT_EVENTS = {
  // Requests
  INITIALIZE: 'combatInitializeRequested',
  PROCESS_INCOMING_ATTACK: 'processIncomingAttackRequested',
  END: 'endCombatRequested',

  // Subscription Requests
  SUB_ATTACK_PROCESSED: 'incomingAttackProcessedSubscribe',
  UNSUB_ATTACK_PROCESSED: 'incomingAttackProcessedUnsubscribe',

  // Declarations
  ATTACK_PROCESSED: 'incomingAttackProcessed'
};
