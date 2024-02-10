import { ATTRIBUTES } from '../dom/attributes';
import { PLACEMENT_EVENTS } from '../events';

export const SHIP_CLASSES = {
  ENTRY: 'fleet-entry',
  SHIP_NAME: 'ship-name',
  BEING_PLACED: 'being-placed'
};
export const SHIP_DATA_ATTRIBUTES = {
  NAME: ATTRIBUTES.DATA('name'),
  SUNK: ATTRIBUTES.DATA('sunk'),
  LENGTH: ATTRIBUTES.DATA('length'),
  ORIENTATION: ATTRIBUTES.DATA('orientation'),
  PLACED: ATTRIBUTES.DATA('placed')
};
export const SHIP_PLACEMENT_EVENTS = PLACEMENT_EVENTS.SHIP;
