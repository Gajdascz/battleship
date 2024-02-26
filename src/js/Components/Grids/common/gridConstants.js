export const createAttributeSelector = ({ elementType, attribute, value }) =>
  `${elementType}[${attribute}='${value}']`;

export const COMMON_GRID = {
  CLASSES: {
    WRAPPER: 'grid-wrapper',
    HEADER: 'grid-header',
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
