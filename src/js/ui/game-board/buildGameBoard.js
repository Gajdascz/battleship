import { buildElementTree } from '../../utility/elementObjBuilder';
import { buildGridObj, addFleetToGridObj } from './gameBoardUIObjects';

/**
 * Creates Battleship Board UI.
 * @param {integer} rows      - Number of rows in grid.
 * @param {integer} cols      - Number of columns in grid.
 * @param {string} letterAxis - Grid axis to use letter labels on.
 * @returns {object} - Buildable Battleship board HTML element.
 */
const buildGameBoardObj = (rows, cols, letterAxis) => {
  const mainGrid = buildGridObj(rows, cols, letterAxis, 'main-grid');
  const mainGridWithFleet = addFleetToGridObj(mainGrid, 'main');
  const trackingGrid = buildGridObj(rows, cols, letterAxis, 'tracking-grid');
  const trackingGridWithFleet = addFleetToGridObj(trackingGrid, 'tracking');
  return {
    type: 'div',
    attributes: { class: 'board', 'data-letter-axis': letterAxis },
    children: [mainGridWithFleet, trackingGridWithFleet]
  };
};

export default function buildGameBoard({ rows = 10, cols = 10, letterAxis = 'row' } = {}) {
  return buildElementTree(buildGameBoardObj(rows, cols, letterAxis));
}
