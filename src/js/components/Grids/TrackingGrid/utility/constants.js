import { INTERACTIVE_ELEMENTS } from '../../../../utility/constants/dom/elements';
import { createAttributeSelector } from '../../common/constants';
import { GENERAL_ATTRIBUTES, INPUT_ATTRIBUTES } from '../../../../utility/constants/dom/attributes';
export const CLASSES = {
  TYPE: 'tracking-grid',
  HEADER: 'tracking-grid-header',
  WRAPPER: 'tracking-grid-wrapper'
};
export const PROPERTIES = {
  CELL_ELEMENT: INTERACTIVE_ELEMENTS.BUTTON,
  HEADER_TEXT: 'Enemy Territory',
  ATTRIBUTES: {
    CELL_STATUS_DATA: GENERAL_ATTRIBUTES.DATA('cell-status'),
    VALUE: INPUT_ATTRIBUTES.VALUE
  }
};
export const SELECTORS = {
  CELL_SELECTOR: (coordinates) =>
    createAttributeSelector({
      elementType: PROPERTIES.CELL_ELEMENT,
      attribute: PROPERTIES.ATTRIBUTES.VALUE,
      value: coordinates
    })
};

export const TRACKING_GRID = {
  CLASSES,
  PROPERTIES,
  SELECTORS
};
