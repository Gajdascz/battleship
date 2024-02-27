export const SHIP_EVENTS = {
  SELECTION: {
    ENABLED: 'shipSelectionEnableRequested',
    DISABLED: 'shipSelectionDisableRequested',
    END: 'shipSelectionEndRequested',
    INITIALIZE_REQUESTED: 'shipSelectionInitializeRequested',
    SELECTION_REQUESTED: 'shipSelectionRequested',
    SELECTION_REQUEST_ACCEPTED: 'shipSelectionRequestAccepted',
    SELECTED: 'shipSelected', // Ship selection request was realized and processed
    DESELECT_REQUESTED: 'shipDeselectRequested',
    DESELECTED: 'shipDeselected',
    ORIENTATION_TOGGLED: 'shipOrientationToggled'
  },
  PLACEMENT: {
    CONTAINER_RECEIVED: 'shipPlacementInitializeRequested',
    ENABLE_PLACEMENT_REQUEST_REQUESTED: 'shipEnablePlacementRequestRequested',
    DISABLE_PLACEMENT_REQUEST_REQUESTED: 'shipDisablePlacementRequestRequested',
    PLACEMENT_COORDINATES_RECEIVED: 'shipPlacementCoordinatesReceived',
    REQUESTED: 'shipPlacementRequested',
    READY: 'shipReadyForPlacement', // Ship selection and placement settings are initialized and ready for placement.
    SET: 'shipPlacementSet', // Ship received and stored placement details
    PICKUP_REQUESTED: 'shipPickupRequested', // Placed ship is selected and requires pick-up
    OVER: 'shipPlacementOver',
    ENABLE_PLACEMENT_REQUESTED: 'shipPlacementEnableRequested',
    DISABLE_PLACEMENT_REQUESTED: 'shipPlacementDisableRequested,'
  },
  COMBAT: {
    SHIP_HIT: 'shipHit',
    SHIP_SUNK: 'shipSunk'
  }
};
