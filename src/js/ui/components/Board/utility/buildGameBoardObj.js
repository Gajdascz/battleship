import { buildElementTree } from '../../utility/elementObjBuilder';
import { buildGridObj } from './buildGridObj';
import { buildFleetListObj } from '../../Fleet/buildFleetListObj';
import { ELEMENT_TYPES, GRID } from '../common/uiConstants';
import { uiObj } from '../common/uiUtility';

/**
 * @module buildGameBoard.js
 * Centralizes the creation of the game board's interface.
 * First compiles all Objects containing board structure and then builds and returns the interface element.
 *
 */

/**
 * Creates Battleship Board UI.
 *
 * @param {number} rows Number of rows in grid.
 * @param {number} cols Number of columns in grid.
 * @param {string} letterAxis Grid axis to use letter labels on.
 * @returns {Object} Structure object to be built into board Interface.
 */
export const buildGameBoardObj = (rows, cols, letterAxis) => {
  const mainGrid = buildGridObj(rows, cols, letterAxis, GRID.COMMON.CLASSES.GRID_TYPES.MAIN);
  const mainGridFleetList = buildFleetListObj(GRID.COMMON.CLASSES.GRID_TYPES.MAIN);
  mainGrid.children.push(mainGridFleetList);
  const trackingGrid = buildGridObj(
    rows,
    cols,
    letterAxis,
    GRID.COMMON.CLASSES.GRID_TYPES.TRACKING
  );
  const trackingGridFleetList = buildFleetListObj(GRID.COMMON.CLASSES.GRID_TYPES.TRACKING);
  trackingGrid.children.push(trackingGridFleetList);
  return uiObj(ELEMENT_TYPES.DIV, {
    attributes: { class: 'board', 'data-letter-axis': letterAxis },
    children: [mainGrid, trackingGrid]
  });
};
