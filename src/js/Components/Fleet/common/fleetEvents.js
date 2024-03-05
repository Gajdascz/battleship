export const FLEET_PLACEMENT_EVENTS = {
  // Requests
  INITIALIZE: 'initializeFleetPlacementRequested',
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

export const FLEET_COMBAT_EVENTS = {
  // Requests
  INITIALIZE: 'initializeFleetCombat',
  HIT_SHIP: 'hitShipInFleetRequested',
  END: 'endFleetCombatRequested',

  // Subscription Requests
  SUB_SHIP_HIT: 'fleetShipHitSubscribe',
  UNSUB_SHIP_HIT: 'fleetShipHitUnsubscribe',
  SUB_SHIP_SUNK: 'fleetShipSunkSubscribe',
  UNSUB_SHIP_SUNK: 'fleetShipSunkUnsubscribe',
  SUB_ALL_SHIPS_SUNK: 'fleetAllShipsSunkSubscribe',
  UNSUB_ALL_SHIPS_SUNK: 'fleetAllShipsSunkUnsubscribe',

  // Declarations
  SHIP_HIT: 'shipInFleetHit',
  SHIP_SUNK: 'shipInFleetSunk',
  ALL_SHIPS_SUNK: 'allShipsInFleetSunk'
};
