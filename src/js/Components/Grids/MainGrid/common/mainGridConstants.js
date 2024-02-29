import { COMMON_ELEMENTS } from '../../../../Utility/constants/dom/elements';
import { GENERAL_ATTRIBUTES } from '../../../../Utility/constants/dom/attributes';
import { createAttributeSelector } from '../../common/gridConstants';

export const MAIN_GRID = {
  TYPE: 'main-grid',
  CLASSES: {
    HEADER: 'main-grid-header',
    WRAPPER: 'main-grid-wrapper',
    HIT_MARKER: 'main-grid-hit-marker',
    VALID_PLACEMENT: 'valid-placement',
    INVALID_PLACEMENT: 'invalid-placement',
    PLACED_SHIP: 'placed-ship'
  },
  PROPERTIES: {
    CELL_ELEMENT: COMMON_ELEMENTS.DIV,
    HEADER_TEXT: 'Home Territory',
    ATTRIBUTES: {
      CELL_COORDINATES_DATA: GENERAL_ATTRIBUTES.DATA('coordinates'),
      PLACED_SHIP_NAME: GENERAL_ATTRIBUTES.DATA('placed-ship-name')
    }
  },
  get INVALID_PLACEMENT_SELECTOR() {
    return `${MAIN_GRID.PROPERTIES.CELL_ELEMENT}.${MAIN_GRID.CLASSES.INVALID_PLACEMENT}`;
  },
  get VALID_PLACEMENT_SELECTOR() {
    return `${MAIN_GRID.PROPERTIES.CELL_ELEMENT}.${MAIN_GRID.CLASSES.VALID_PLACEMENT}`;
  },
  CELL_SELECTOR: (coordinates) =>
    createAttributeSelector({
      elementType: MAIN_GRID.PROPERTIES.CELL_ELEMENT,
      attribute: MAIN_GRID.PROPERTIES.ATTRIBUTES.CELL_COORDINATES_DATA,
      value: coordinates
    }),
  PLACED_SHIP_SELECTOR: (id) =>
    createAttributeSelector({
      elementType: MAIN_GRID.PROPERTIES.CELL_ELEMENT,
      attribute: MAIN_GRID.PROPERTIES.ATTRIBUTES.PLACED_SHIP_NAME,
      value: id
    })
};
