import { ELEMENTS } from '../dom/elements';
import { ATTRIBUTES } from '../dom/attributes';
import { LETTER_AXES } from '../common';

const createCellSelector = ({ elementType, attribute, value }) =>
  `${elementType}[${attribute}='${value}']`;

export const GRID_COMMON = {
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
  CELL_SELECTOR: () => `.${GRID_COMMON.CLASSES.CELL}`
};
export const TRACKING_GRID = {
  CLASSES: {
    TYPE: 'tracking-grid',
    HEADER: 'tracking-grid-header',
    WRAPPER: 'tracking-grid-wrapper'
  },
  PROPERTIES: {
    CELL_ELEMENT: ELEMENTS.STRUCTURAL.BUTTON,
    HEADER_TEXT: 'Enemy Territory',
    ATTRIBUTES: {
      CELL_STATUS: ATTRIBUTES.DATA('cell-status'),
      VALUE: ATTRIBUTES.INPUT.VALUE
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
  CLASSES: {
    TYPE: 'main-grid',
    HEADER: 'main-grid-header',
    WRAPPER: 'main-grid-wrapper',
    HIT_MARKER: 'main-grid-hit-marker'
  },
  PROPERTIES: {
    CELL_ELEMENT: ELEMENTS.STRUCTURAL.DIV,
    HEADER_TEXT: 'Home Territory',
    ATTRIBUTES: {
      COORDINATES_DATA: ATTRIBUTES.DATA('coordinates')
    }
  },
  CELL_SELECTOR: (coordinates) =>
    createCellSelector({
      elementType: MAIN_GRID.PROPERTIES.CELL_ELEMENT,
      attribute: MAIN_GRID.PROPERTIES.ATTRIBUTES.COORDINATES_DATA,
      value: coordinates
    })
};
