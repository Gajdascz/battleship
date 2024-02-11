import { INTERACTIVE_ELEMENTS, STRUCTURAL_ELEMENTS } from '../dom/elements';
import { GENERAL_ATTRIBUTES, INPUT_ATTRIBUTES } from '../dom/attributes';
import { LETTER_AXES } from '../common';

const createCellSelector = ({ elementType, attribute, value }) =>
  `${elementType}[${attribute}='${value}']`;

export const COMMON_GRID = {
  LETTER_AXES,
  CLASSES: {
    CELL: 'grid-cell',
    ROW: 'board-row',
    LABELS: {
      ROW: 'board-row-label',
      COL_CONTAINER: 'board-col-labels',
      COL: 'board-col-label'
    }
  },
  LABEL_TYPES: {
    LETTER: 'letter',
    NUMERIC: 'numeric'
  },
  get CELL_SELECTOR() {
    return `.${COMMON_GRID.CLASSES.CELL}`;
  }
};
export const TRACKING_GRID = {
  TYPE: 'tracking-grid',
  CLASSES: {
    HEADER: 'tracking-grid-header',
    WRAPPER: 'tracking-grid-wrapper'
  },
  PROPERTIES: {
    CELL_ELEMENT: INTERACTIVE_ELEMENTS.BUTTON,
    HEADER_TEXT: 'Enemy Territory',
    ATTRIBUTES: {
      CELL_STATUS_DATA: GENERAL_ATTRIBUTES.DATA('cell-status'),
      VALUE: INPUT_ATTRIBUTES.VALUE
    }
  },
  CELL_SELECTOR: (coordinates) =>
    createCellSelector({
      elementType: TRACKING_GRID.PROPERTIES.CELL_ELEMENT,
      attribute: TRACKING_GRID.PROPERTIES.ATTRIBUTES.VALUE,
      value: coordinates
    })
};

export const MAIN_GRID = {
  TYPE: 'main-grid',
  CLASSES: {
    HEADER: 'main-grid-header',
    WRAPPER: 'main-grid-wrapper',
    HIT_MARKER: 'main-grid-hit-marker'
  },
  PROPERTIES: {
    CELL_ELEMENT: STRUCTURAL_ELEMENTS.DIV,
    HEADER_TEXT: 'Home Territory',
    ATTRIBUTES: {
      CELL_COORDINATES_DATA: GENERAL_ATTRIBUTES.DATA('coordinates')
    }
  },
  CELL_SELECTOR: (coordinates) =>
    createCellSelector({
      elementType: MAIN_GRID.PROPERTIES.CELL_ELEMENT,
      attribute: MAIN_GRID.PROPERTIES.ATTRIBUTES.CELL_COORDINATES_DATA,
      value: coordinates
    })
};
