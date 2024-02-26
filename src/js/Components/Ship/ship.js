import { GENERAL_ATTRIBUTES } from '../../Utility/constants/dom/attributes';

export const SHIP_CLASSES = {
  ENTRY: 'fleet-entry',
  SHIP_NAME: 'ship-name',
  SELECTED: 'ship-selected'
};
export const SHIP_DATA_ATTRIBUTES = {
  NAME: GENERAL_ATTRIBUTES.DATA('name'),
  SUNK: GENERAL_ATTRIBUTES.DATA('sunk'),
  LENGTH: GENERAL_ATTRIBUTES.DATA('length'),
  ORIENTATION: GENERAL_ATTRIBUTES.DATA('orientation'),
  PLACED: GENERAL_ATTRIBUTES.DATA('placed')
};

export const ROTATE_SHIP_BUTTON = {
  CLASS: 'rotate-ship-button',
  TEXT: 'Rotate Ship'
};
