import { GENERAL_ATTRIBUTES } from '../../../utility/constants/dom/attributes';

export const SHIP_CLASSES = {
  ENTRY: 'ship-element',
  NAME: 'ship-name',
  SELECTED: 'ship-selected'
};
export const SHIP_DATA_ATTRIBUTES = {
  SHIP_NAME: GENERAL_ATTRIBUTES.DATA('name'),
  SHIP_SUNK: GENERAL_ATTRIBUTES.DATA('sunk'),
  SHIP_LENGTH: GENERAL_ATTRIBUTES.DATA('length'),
  SHIP_ORIENTATION: GENERAL_ATTRIBUTES.DATA('orientation'),
  SHIP_PLACED: GENERAL_ATTRIBUTES.DATA('placed')
};

export const SHIP_ROTATE_BUTTON = {
  CLASS: 'rotate-ship-button',
  TEXT: 'Rotate Ship'
};
