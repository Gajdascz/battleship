import { buildElementTree } from '../utility-ui/elementObjBuilder';

const getLetter = (num) => String.fromCharCode(65 + num);

const getLabelObj = (label, classAttr) => {
  return {
    type: 'div',
    text: `${label}`,
    attributes: { class: classAttr }
  };
};

const getGridHeaderObj = (gridType) => {
  let text, classAttr;
  if (gridType === 'main-grid') {
    text = 'Home Territory';
    classAttr = 'main-grid-header';
  } else {
    text = 'Enemy Territory';
    classAttr = 'tracking-grid-header';
  }
  return {
    type: 'div',
    attributes: { class: classAttr },
    children: [{ type: 'p', text }]
  };
};

const buildGridCellObj = (row, col, elementType = 'button') => {
  const elementValue = elementType === 'button' ? { value: `${row + col}` } : { 'data-coordinates': `${row + col}` };
  return {
    type: elementType,
    attributes: {
      class: 'grid-cell',
      ...elementValue
    }
  };
};

const getColLabelsObj = (cols, letterAxis) => {
  const colLabels = [];
  for (let i = 0; i < cols; i++) {
    const colLabel = letterAxis === 'rows' ? i : getLetter(i);
    colLabels.push(getLabelObj(colLabel, 'board-col-label'));
  }
  return {
    type: 'div',
    attributes: { class: 'board-col-labels' },
    children: colLabels
  };
};

const buildGridRowObj = (row, cols, gridType) => {
  const cells = [];
  const cellType = gridType === 'tracking-grid' ? 'button' : 'div';
  for (let i = 0; i < cols; i++) {
    const colLabel = typeof row === 'string' ? i : getLetter(i);
    cells.push(buildGridCellObj(row, colLabel, cellType));
  }
  return {
    type: 'div',
    attributes: { class: `board-row` },
    children: [getLabelObj(row, 'board-row-label'), ...cells]
  };
};

const buildGridObj = (rows, cols, letterAxis, gridType) => {
  const rowObjs = [];
  for (let i = 0; i < rows; i++) {
    const rowLabel = letterAxis === 'rows' ? getLetter(i) : i;
    rowObjs.push(buildGridRowObj(rowLabel, cols, gridType));
  }
  return {
    type: 'div',
    attributes: { class: gridType },
    children: [getGridHeaderObj(gridType), getColLabelsObj(cols, letterAxis), ...rowObjs]
  };
};

const buildGameBoardObj = (rows, cols, letterAxis) => {
  return {
    type: 'div',
    attributes: { class: 'board' },
    children: [buildGridObj(rows, cols, letterAxis, 'main-grid'), buildGridObj(rows, cols, letterAxis, 'tracking-grid')]
  };
};

export default function buildGameBoard({ rows = 10, cols = 10, letterAxis = 'rows' } = {}) {
  const gameBoardObj = buildGameBoardObj(rows, cols, letterAxis);
  return buildElementTree(gameBoardObj);
}
