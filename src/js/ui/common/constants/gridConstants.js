import { ELEMENT_TYPES, ELEMENT_ATTRIBUTES, ORIENTATIONS, RESULTS } from './baseConstants';
const GRIDS = {
  COMMON: {
    CLASSES: {
      CELL: 'grid-cell',
      ROW: 'board-row',
      LABELS: {
        ROW: 'board-row-label',
        COL_CONTAINER: 'board-col-labels',
        COL: 'board-col-label'
      },
      GRID_TYPES: {
        MAIN: 'main-grid',
        TRACKING: 'tracking-grid'
      }
    },
    ORIENTATIONS,
    RESULTS
  },
  MAIN: {
    ELEMENTS: {
      CELL: ELEMENT_TYPES.DIV
    },
    CLASSES: {
      HEADER: 'main-grid-header',
      WRAPPER: 'main-grid-wrapper',
      HIT_MARKER: 'main-grid-hit-marker'
    },
    ATTRIBUTES: {
      COORDINATES: ELEMENT_ATTRIBUTES.DATA('coordinates')
    },
    TEXTS: {
      MAIN: {
        HEADER: 'Home Territory'
      }
    }
  },
  TRACKING: {
    ELEMENTS: {
      CELL: ELEMENT_TYPES.BUTTON
    },
    CLASSES: {
      HEADER: 'tracking-grid-header',
      WRAPPER: 'tracking-grid-wrapper'
    },
    ATTRIBUTES: {
      CELL_STATUS: ELEMENT_ATTRIBUTES.DATA('cell-status'),
      VALUE: ELEMENT_ATTRIBUTES.VALUE
    },
    TEXTS: {
      HEADER: 'Enemy Territory'
    },
    STATUS_VALUES: {
      UNEXPLORED: 'unexplored',
      HIT: 'hit',
      MISS: 'miss'
    }
  }
};
const GRID_SELECTORS = {
  COMMON: {
    CELL: () => `.${GRIDS.COMMON.CLASSES.CELL}`
  },
  MAIN: {
    CELL: {
      COORDINATES: (coordinates) =>
        `${GRIDS.MAIN.ELEMENTS.CELL}[${GRIDS.MAIN.ATTRIBUTES.COORDINATES}='${coordinates}']`
    }
  },
  TRACKING: {
    CELL: {
      VALUE: (coordinates) =>
        `${GRIDS.TRACKING.ELEMENTS.CELL}[${GRIDS.TRACKING.ATTRIBUTES.VALUE}='${coordinates}']`
    }
  }
};

export { GRIDS, GRID_SELECTORS };
