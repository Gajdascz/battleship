export const SHIP_EVENTS = {
  SELECTION_PLACEMENT: {
    INITIALIZE_REQUESTED: 'shipSelectionAndPlacementInitializeRequested',
    END_REQUESTED: 'shipSelectionAndPlacementEndRequested'
  },
  SELECTION: {
    REQUEST: {
      INITIALIZE: 'shipSelectionInitializeRequested',
      ENABLE: 'shipSelectionEnableRequested',
      DISABLE: 'shipSelectionDisableRequested',
      SELECT: 'shipSelectionRequested',
      DESELECT: 'shipDeselectRequested',
      SUB_SELECTED: 'shipSelectedSubscribe',
      UNSUB_SELECTED: 'shipSelectedUnsubscribe',
      SUB_ORIENTATION_TOGGLED: 'shipOrientationToggledSubscribe',
      UNSUB_ORIENTATION_TOGGLED: 'shipOrientationToggledUnsubscribe',
      END: 'shipSelectionEnded'
    },
    DECLARE: {
      SELECT_REQUEST_RECEIVED: 'shipSelectionRequestReceived',
      SELECTED: 'shipSelected',
      DESELECT_REQUEST_RECEIVED: 'shipDeselectRequestReceived',
      DESELECTED: 'shipDeselected',
      ORIENTATION_TOGGLED: 'shipOrientationToggled'
    }
  },
  PLACEMENT: {
    REQUEST: {
      INITIALIZE_REQUESTED: 'shipPlacementInitializeRequested',
      ENABLE_PLACEMENT_REQUEST_REQUESTED: 'shipEnablePlacementRequestRequested',
      DISABLE_PLACEMENT_REQUEST_REQUESTED: 'shipDisablePlacementRequestRequested',
      END: 'shipPlacementEnded',
      SET_COORDINATES: 'setShipPlacementCoordinatesRequested',
      PICKUP_REQUESTED: 'shipPickupRequested' // Placed ship is selected and requires pick-up
    },
    DECLARE: {
      CONTAINER_RECEIVED: 'shipPlacementContainerReceived',
      PLACEMENT_COORDINATES_RECEIVED: 'shipPlacementCoordinatesReceived',
      READY: 'shipReadyForPlacement', // Ship selection and placement settings are initialized and ready for placement.
      SET: 'shipPlacementSet' // Ship received and stored placement details
    }
  },
  COMBAT: {
    HIT_REQUEST_RECEIVED: 'shipHitRequestReceived',
    HIT_REQUESTED: 'shipHitRequested',
    HIT_PROCESSED: 'shipHitProcessed',
    SUNK: 'shipSunk'
  }
};
