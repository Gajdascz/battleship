import { INTERACTIVE_ELEMENTS } from '../../../../Utility/constants/dom/elements';
import { createAttributeSelector } from '../../common/gridConstants';
import { GENERAL_ATTRIBUTES, INPUT_ATTRIBUTES } from '../../../../Utility/constants/dom/attributes';
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
      CELL_STATUS_DATA: GENERAL_ATTRIBUTES.DATA('cell-status'),
      CELL_STATUS_ACCESSOR: 'cellStatus'
    }
  },
  SELECTORS: {
    CELL: (coordinates) =>
      createAttributeSelector({
        elementType: TRACKING_GRID.PROPERTIES.CELL_ELEMENT,
        attribute: INPUT_ATTRIBUTES.VALUE,
        value: coordinates
      })
  }
};
