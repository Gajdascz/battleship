import { paragraphObj, divObj } from '../utility-ui/basicUIObjects';

const getLetter = (num) => String.fromCharCode(65 + num);

// Returns Objects that can be built into HTML elements

const gridHeaderObj = (gridType) => {
  return divObj({ class: gridType === 'main-grid' ? 'main-grid-header' : 'tracking-grid-header' }, [
    paragraphObj(gridType === 'main-grid' ? 'Home Territory' : 'Enemy Territory')
  ]);
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
    colLabels.push(paragraphObj(`${colLabel}`, { class: 'board-col-label' }));
  }
  return divObj({ class: 'board-col-labels' }, colLabels);
};

const buildGridRowObj = (row, cols, gridType) => {
  const cells = [];
  const cellType = gridType === 'tracking-grid' ? 'button' : 'div';
  for (let i = 0; i < cols; i++) {
    const colLabel = typeof row === 'string' ? i : getLetter(i);
    cells.push(gridCellObj(row, `${colLabel}`, cellType, gridType === 'tracking-grid'));
  }
  return {
    type: 'div',
    attributes: { class: `board-row` },
    children: [paragraphObj(`${row}`, { class: 'board-row-label' }), ...cells]
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
  if (gridType === 'main') {
    const listContainer = divObj({ class: 'main-fleet-list' });
    classAttr = 'main-fleet-list-container';
    const playerFleetHeader = paragraphObj('Your Fleet', { class: 'main-fleet-list-container-header' });
    children.push(playerFleetHeader, listContainer);
  } else {
    const listContainer = divObj({ class: 'tracking-fleet-list' });
    classAttr = 'tracking-fleet-list-container';
    const opponentFleetHeader = paragraphObj('Enemy Fleet', { class: 'tracking-fleet-list-container-header' });
    children.push(opponentFleetHeader, listContainer);
  }
  return divObj({ class: classAttr }, children);
};

const addFleetToGridObj = (grid, gridType) => {
  const wrapper = divObj({ class: gridType === 'main' ? 'main-grid-wrapper' : 'tracking-grid-wrapper' });
  const fleetContainer = fleetContainerObj(gridType);
  wrapper.children = [grid, fleetContainer];
  return wrapper;
};

export { buildGridObj, addFleetToGridObj };
