import { INTERACTIVE_ELEMENTS } from '../../../../Utility/constants/dom/elements';
import { createAttributeSelector } from '../../common/gridConstants';
import { GENERAL_ATTRIBUTES } from '../../../../Utility/constants/dom/attributes';
export const TRACKING_GRID = {
  CLASSES: {
    TYPE: 'tracking-grid',
    HEADER: 'tracking-grid-header',
    WRAPPER: 'tracking-grid-wrapper'
  },
  PROPERTIES: {
    CELL_ELEMENT: INTERACTIVE_ELEMENTS.BUTTON,
    HEADER_TEXT: 'Enemy Territory',
    ATTRIBUTES: {
      CELL_STATUS_DATA: GENERAL_ATTRIBUTES.DATA('cell-status')
    }
  },
  SELECTORS: {
    CELL_SELECTOR: (coordinates) =>
      createAttributeSelector({
        elementType: TRACKING_GRID.PROPERTIES.CELL_ELEMENT,
        attribute: TRACKING_GRID.PROPERTIES.ATTRIBUTES.VALUE,
        value: coordinates
      })
  }
};
