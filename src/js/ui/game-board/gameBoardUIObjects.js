const getLetter = (num) => String.fromCharCode(65 + num);

// Returns Objects that can be built into HTML elements

const wrapperObj = (classAttr) => {
  return {
    type: 'div',
    attributes: { class: classAttr }
  };
};

const labelObj = (label, classAttr) => {
  return {
    type: 'div',
    text: `${label}`,
    attributes: { class: classAttr }
  };
};

const gridHeaderObj = (gridType) => {
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

const gridCellObj = (row, col, elementType = 'button', isTracking) => {
  const elementValue = elementType === 'button' ? { value: `${row + col}` } : { 'data-coordinates': `${row + col}` };
  return {
    type: elementType,
    attributes: {
      class: 'grid-cell',
      ...elementValue,
      ...(isTracking && { 'data-cell-status': 'unexplored' })
    }
  };
};

const colLabelsObj = (cols, letterAxis) => {
  const colLabels = [];
  for (let i = 0; i < cols; i++) {
    const colLabel = letterAxis === 'row' ? i : getLetter(i);
    colLabels.push(labelObj(colLabel, 'board-col-label'));
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
    cells.push(gridCellObj(row, colLabel, cellType, gridType === 'tracking-grid'));
  }
  return {
    type: 'div',
    attributes: { class: `board-row` },
    children: [labelObj(row, 'board-row-label'), ...cells]
  };
};

const buildGridObj = (rows, cols, letterAxis, gridType) => {
  const rowObjs = [];
  for (let i = 0; i < rows; i++) {
    const rowLabel = letterAxis === 'row' ? getLetter(i) : i;
    rowObjs.push(buildGridRowObj(rowLabel, cols, gridType));
  }
  return {
    type: 'div',
    attributes: { class: gridType },
    children: [gridHeaderObj(gridType), colLabelsObj(cols, letterAxis), ...rowObjs]
  };
};

const fleetContainerObj = (gridType) => {
  let classAttr;
  const children = [];
  const fleetShipListContainer = fleetShipListContainerObj();
  if (gridType === 'main') {
    classAttr = 'fleet-container';
    const playerFleetHeader = fleetHeaderObj('Your Fleet');
    children.push(playerFleetHeader, fleetShipListContainer);
  } else {
    classAttr = 'opponent-fleet-container';
    const opponentFleetHeader = fleetHeaderObj('Enemy Fleet');
    children.push(opponentFleetHeader, fleetShipListContainer);
  }
  return {
    type: 'div',
    attributes: { class: classAttr },
    children
  };
};

const fleetShipListContainerObj = () => {
  return {
    type: 'div',
    attributes: {
      class: 'fleet-ship-list-container'
    }
  };
};
const fleetHeaderObj = (text) => {
  return {
    type: 'p',
    text,
    attributes: { class: 'player-fleet-header' }
  };
};

const addFleetToGridObj = (grid, gridType) => {
  const wrapper = wrapperObj(gridType === 'main' ? 'main-grid-wrapper' : 'tracking-grid-wrapper');
  const fleetContainer = fleetContainerObj(gridType);
  wrapper.children = [grid, fleetContainer];
  return wrapper;
};

export { buildGridObj, addFleetToGridObj };
