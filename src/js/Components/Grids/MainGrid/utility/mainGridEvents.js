export const MAIN_GRID_EVENTS = {
  PLACEMENT: {
    INITIALIZE_REQUESTED: 'gridPlacementInitializeRequested', // Request initializing the grid placement controller
    GRID_INITIALIZED: 'gridInitialized', // Grid placement controller is initialized
    ENTITY_PLACEMENT_REQUESTED: 'gridEntityPlacementRequested', // Entity is requesting placement on the grid
    ENTITY_ORIENTATION_UPDATED: 'gridEntityOrientationUpdated', // Orientation of selected entity has changed
    ENTITY_SELECTED: 'gridEntitySelected', // Entity related to grid has been selected
    ENTITY_PLACEMENT_PROCESSED: 'gridPlacementProcessed', // Entity placed and accepted in grid
    TOGGLE_PLACEMENT_SUBMISSION_REQUEST: 'gridToggleSubmissionRequest', // Request to check and toggle the submit placements button
    PLACEMENTS_SUBMITTED: 'gridPlacementsSubmitted', // Player submitted their ship placements for processing
    FINALIZATION_REQUESTED: 'gridPlacementsFinalizationRequested', // Player placement submission parsed for grid-placement
    FINALIZED: 'gridPlacementsFinalized', // Placements have been processed and finalized
    END_REQUESTED: 'gridPlacementEndRequested' // Grid placement state is over
  }
};
