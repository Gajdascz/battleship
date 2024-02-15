import { GENERAL_ATTRIBUTES } from '../../../utility/constants/dom/attributes';

export const CLASSES = {
  ENTRY: 'fleet-entry',
  NAME: 'ship-name',
  SELECTED: 'ship-selected'
};
export const DATA_ATTRIBUTES = {
  NAME: GENERAL_ATTRIBUTES.DATA('name'),
  SUNK: GENERAL_ATTRIBUTES.DATA('sunk'),
  LENGTH: GENERAL_ATTRIBUTES.DATA('length'),
  ORIENTATION: GENERAL_ATTRIBUTES.DATA('orientation'),
  PLACED: GENERAL_ATTRIBUTES.DATA('placed')
};

export const ROTATE_BUTTON = {
  CLASS: 'rotate-ship-button',
  TEXT: 'Rotate Ship'
};
