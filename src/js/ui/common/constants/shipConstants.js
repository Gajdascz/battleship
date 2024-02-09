import { STATES, ORIENTATIONS, ELEMENT_ATTRIBUTES } from './baseConstants';

export const SHIP = {
  CLASSES: {
    ENTRY: 'fleet-entry',
    SHIP_NAME: 'ship-name',
    BEING_PLACED: 'being-placed'
  },
  DATA: {
    NAME: ELEMENT_ATTRIBUTES.DATA('name'),
    SUNK: ELEMENT_ATTRIBUTES.DATA('sunk'),
    LENGTH: ELEMENT_ATTRIBUTES.DATA('length'),
    ORIENTATION: ELEMENT_ATTRIBUTES.DATA('orientation'),
    PLACED: ELEMENT_ATTRIBUTES.DATA('placed')
  },
  EVENTS: {
    SELECTED: 'shipSelected',
    ORIENTATION_CHANGED: 'shipOrientationChanged',
    PLACED: 'shipPlaced',
    PLACED_SUCCESS: 'shipPlacementSuccessful'
  },
  ORIENTATIONS: {
    VERTICAL: ORIENTATIONS.VERTICAL,
    HORIZONTAL: ORIENTATIONS.HORIZONTAL
  },
  STATES: {
    PLACEMENT: STATES.PLACEMENT,
    PROGRESS: STATES.PROGRESS
  }
};
