export const MAIN_GRID_EVENTS = {
  PLACEMENT: {
    ENABLE_SUBMIT_PLACEMENTS_BUTTON: 'gridEnableSubmitPlacementsButton',
    DISABLE_SUBMIT_PLACEMENTS_BUTTON: 'gridDisableSubmitPlacementsButton',
    PROCESSED: 'gridPlacementProcessed', // Entity placed and accepted in grid
    FINALIZATION_REQUESTED: 'gridPlacementsFinalizationRequested', // Player submitted their ship placements for processing
    FINALIZED: 'gridPlacementsFinalized' // Placements have been processed and finalized
  }
};
