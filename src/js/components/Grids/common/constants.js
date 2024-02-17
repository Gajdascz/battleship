export const createAttributeSelector = ({ elementType, attribute, value }) =>
  `${elementType}[${attribute}='${value}']`;

export const CLASSES = {
  CELL: 'grid-cell',
  ROW: 'board-row',
  LABELS: {
    ROW: 'board-row-label',
    COL_CONTAINER: 'board-col-labels',
    COL: 'board-col-label'
  }
};

export const LABEL_TYPES = {
  LETTER: 'letter',
  NUMERIC: 'numeric'
};

export const SELECTORS = {
  get CELL_SELECTOR() {
    return `.${CLASSES.CELL}`;
  }
};
