export const FLEET_EVENTS = {
  PLACEMENT: {
    REQUEST: {
      INITIALIZE: 'initializeFleetRequested',
      SELECT: 'selectShipFromFleetRequested',
      SUB_SELECTED: 'fleetShipSelectedSubscribe',
      UNSUB_SELECTED: 'fleetShipSelectedUnsubscribe',
      SUB_ORIENTATION_TOGGLE: 'fleetShipOrientationToggleSubscribe',
      UNSUB_ORIENTATION_TOGGLE: 'fleetShipOrientationToggleUnsubscribe',
      END: 'fleetPlacementEndRequested'
    },
    DECLARE: {
      SELECTED: 'shipSelectedFromFleet'
    }
  }
};
