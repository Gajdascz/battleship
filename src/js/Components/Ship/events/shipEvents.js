export const SHIP_EVENTS = {
  SELECTION: {
    REQUESTED: 'shipSelectionRequested',
    SELECTED: 'shipSelected', // Ship selection request was realized and processed
    DESELECTED: 'shipDeselected',
    ORIENTATION_TOGGLED: 'shipOrientationToggled'
  },
  PLACEMENT: {
    CONTAINER_CREATED: 'shipPlacementContainerCreated', // A container has been created for ships to be placed within
    REQUESTED: 'shipPlacementRequested',
    READY: 'shipReadyForPlacement', // Ship selection and placement settings are initialized and ready for placement.
    SET: 'shipPlacementSet', // Ship received and stored placement details
    PICKUP_REQUESTED: 'shipPickupRequested', // Placed ship is selected and requires pick-up
    OVER: 'shipPlacementOver',
    PLACEMENT_COORDINATES_RECEIVED: 'shipPlacementCoordinatesReceived'
  },
  COMBAT: {
    SHIP_HIT: 'shipHit',
    SHIP_SUNK: 'shipSunk'
  }
};
