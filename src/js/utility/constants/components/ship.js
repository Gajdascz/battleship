import { GENERAL_ATTRIBUTES } from '../dom/attributes';
import { PLACEMENT_EVENTS } from '../events';

export const SHIP_CLASSES = {
  ENTRY: 'fleet-entry',
  SHIP_NAME: 'ship-name',
  BEING_PLACED: 'being-placed'
};
export const SHIP_DATA_ATTRIBUTES = {
  NAME: GENERAL_ATTRIBUTES.DATA('name'),
  SUNK: GENERAL_ATTRIBUTES.DATA('sunk'),
  LENGTH: GENERAL_ATTRIBUTES.DATA('length'),
  ORIENTATION: GENERAL_ATTRIBUTES.DATA('orientation'),
  PLACED: GENERAL_ATTRIBUTES.DATA('placed')
};
export const SHIP_PLACEMENT_EVENTS = PLACEMENT_EVENTS.SHIP;
