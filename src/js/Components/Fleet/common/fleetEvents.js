export const FLEET_PLACEMENT_EVENTS = {
  // Requests
  INITIALIZE: 'initializeFleetRequested',
  SELECT: 'selectShipFromFleetRequested',
  SET_COORDINATES: 'setShipPlacementCoordinates',
  END: 'fleetPlacementEndRequested',

  // Subscription Requests
  SUB_SELECTED: 'fleetShipSelectedSubscribe',
  UNSUB_SELECTED: 'fleetShipSelectedUnsubscribe',
  SUB_ORIENTATION_TOGGLED: 'fleetShipOrientationToggleSubscribe',
  UNSUB_ORIENTATION_TOGGLED: 'fleetShipOrientationToggleUnsubscribe',
  SUB_ALL_SHIPS_PLACED: 'allShipsInFleetPlacedSubscribe',
  UNSUB_ALL_SHIPS_PLACED: 'allShipsInFleetPlacedUnsubscribe',
  SUB_SHIP_NO_LONGER_PLACED: 'shipNoLongerPlacedSubscribe',
  UNSUB_SHIP_NO_LONGER_PLACED: 'shipNoLongerPlacedUnsubscribe',

  // Declarations
  SELECTED: 'shipSelectedFromFleet',
  ALL_SHIPS_PLACED: 'allShipsInFleetPlaced',
  SHIP_NO_LONGER_PLACED: 'shipNoLongerPlaced'
};
