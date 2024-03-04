export const SHIP_SELECTION_EVENTS = {
  // Requests
  INITIALIZE: 'shipSelectionInitializeRequested',
  ENABLE: 'shipSelectionEnableRequested',
  DISABLE: 'shipSelectionDisableRequested',
  SELECT: 'shipSelectionRequested',
  DESELECT: 'shipDeselectRequested',
  END: 'selectionEndRequest',

  // Subscription Requests
  SUB_SELECTED: 'shipSelectedSubscribe',
  UNSUB_SELECTED: 'shipSelectedUnsubscribe',
  SUB_ORIENTATION_TOGGLED: 'shipOrientationToggledSubscribe',
  UNSUB_ORIENTATION_TOGGLED: 'shipOrientationToggledUnsubscribe',

  // Declarations
  SELECT_REQUEST_RECEIVED: 'shipSelectionRequestReceived',
  SELECTED: 'shipSelected',
  DESELECT_REQUEST_RECEIVED: 'shipDeselectRequestReceived',
  DESELECTED: 'shipDeselected',
  ORIENTATION_TOGGLED: 'shipOrientationToggled'
};

export const SHIP_PLACEMENT_EVENTS = {
  // Requests
  INITIALIZE: 'shipPlacementInitializeRequested',
  ENABLE_PLACEMENT: 'shipEnablePlacementRequestRequested',
  DISABLE_PLACEMENT: 'shipDisablePlacementRequestRequested',
  SET_COORDINATES: 'setShipPlacementCoordinatesRequested',
  PICKUP: 'shipPickupRequested', // Placed ship is selected and requires pick-up
  END: 'shipPlacementEndRequested'
};

export const SHIP_EVENTS = {
  COMBAT: {
    HIT_REQUEST_RECEIVED: 'shipHitRequestReceived',
    HIT_REQUESTED: 'shipHitRequested',
    HIT_PROCESSED: 'shipHitProcessed',
    SUNK: 'shipSunk'
  }
};
