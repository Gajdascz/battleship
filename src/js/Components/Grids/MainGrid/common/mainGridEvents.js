export const MAIN_GRID_EVENTS = {
  PLACEMENT: {
    REQUEST: {
      INITIALIZE: 'gridPlacementInitializeRequested', // Request initializing the grid placement controller
      ENTITY_SELECT: 'gridEntitySelected', // Entity related to grid has been selected
      ENTITY_PLACEMENT: 'gridEntityPlacementRequested', // Entity is requesting placement on the grid
      ENTITY_ORIENTATION_UPDATE: 'gridEntityOrientationUpdated', // Orientation of selected entity has changed
      ENABLE_PLACEMENT_SUBMISSION: 'gridEnableSubmissionRequest',
      DISABLE_PLACEMENT_SUBMISSION: 'gridDisableSubmissionRequest',
      SUBMISSION: 'gridPlacementsFinalizationRequested', // Player placement submission parsed for grid-placement
      END: 'gridPlacementEndRequested', // Grid placement state is over
      SUB_PLACEMENT_PROCESSED: 'gridPlacementProcessedSubscribe',
      UNSUB_PLACEMENT_PROCESSED: 'gridPlacementProcessedUnsubscribe'
    },
    DECLARE: {
      GRID_INITIALIZED: 'gridInitialized', // Grid placement controller is initialized
      ENTITY_PLACEMENT_PROCESSED: 'gridPlacementProcessed', // Entity placed and accepted in grid
      PLACEMENTS_SUBMITTED: 'gridPlacementsSubmitted', // Player submitted their ship placements for processing
      FINALIZED: 'gridPlacementsFinalized' // Placements have been processed and finalized
    }
  },
  COMBAT: {
    INCOMING_ATTACK_REQUESTED: 'incomingAttackRequested',
    INCOMING_ATTACK_PROCESSED: 'incomingAttackProcessed'
  }
};
