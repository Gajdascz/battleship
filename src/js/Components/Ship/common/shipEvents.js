export const SHIP_EVENTS = {
  SELECTION_PLACEMENT: {
    INITIALIZE_REQUESTED: 'shipSelectionAndPlacementInitializeRequested',
    END_REQUESTED: 'shipSelectionAndPlacementEndRequested'
  },
  SELECTION: {
    ENABLED: 'shipSelectionEnableRequested',
    DISABLED: 'shipSelectionDisableRequested',
    INITIALIZE_REQUESTED: 'shipSelectionInitializeRequested',
    SELECTION_REQUESTED: 'shipSelectionRequested',
    SELECT_REQUEST_RECEIVED: 'shipSelectionRequestReceived',
    SELECTED: 'shipSelected',
    DESELECT_REQUESTED: 'shipDeselectRequested',
    DESELECT_REQUEST_RECEIVED: 'shipDeselectRequestReceived',
    DESELECTED: 'shipDeselected',
    ORIENTATION_TOGGLED: 'shipOrientationToggled',
    END_REQUESTED: 'shipSelectionEnded'
  },
  PLACEMENT: {
    INITIALIZE_REQUESTED: 'shipPlacementInitializeRequested',
    CONTAINER_RECEIVED: 'shipPlacementContainerReceived',
    ENABLE_PLACEMENT_REQUEST_REQUESTED: 'shipEnablePlacementRequestRequested',
    DISABLE_PLACEMENT_REQUEST_REQUESTED: 'shipDisablePlacementRequestRequested',
    PLACEMENT_COORDINATES_RECEIVED: 'shipPlacementCoordinatesReceived',
    REQUESTED: 'shipPlacementRequested',
    READY: 'shipReadyForPlacement', // Ship selection and placement settings are initialized and ready for placement.
    SET: 'shipPlacementSet', // Ship received and stored placement details
    PICKUP_REQUESTED: 'shipPickupRequested', // Placed ship is selected and requires pick-up
    ENABLE_PLACEMENT_REQUESTED: 'shipPlacementEnableRequested',
    DISABLE_PLACEMENT_REQUESTED: 'shipPlacementDisableRequested,',
    END_REQUESTED: 'shipPlacementEndRequested',
    END: 'shipPlacementEnded'
  },
  COMBAT: {
    HIT_REQUEST_RECEIVED: 'shipHitRequestReceived',
    HIT_REQUESTED: 'shipHitRequested',
    HIT_PROCESSED: 'shipHitProcessed',
    SUNK: 'shipSunk'
  }
};
