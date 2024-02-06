import { ELEMENT_TYPES, GRID } from '../common/uiConstants';
import { getLetter, uiObj } from '../common/uiUtility';
/**
 * @module buildGridObj.js
 * Provides the structured Object for the game board's specified grid.
 * This object should be built into an HTML Element and provides the fundamental interface
 * for playing Battleship.
 *
 * Expected gridType includes: 'main-grid' or 'tracking-grid'
 *
 */

const isMain = (gridType) => gridType === GRID.TYPES.MAIN;

/**
 * Creates the grid's header Object.
 *
 * @param {string} gridType Grid to create header for.
 * @returns {Object} Contains details for creating the grid's header Element.
 */
const gridHeaderObj = (gridType) =>
  uiObj(ELEMENT_TYPES.DIV, {
    attributes: {
      class: isMain(gridType) ? GRID.MAIN.HEADER_CLASS : GRID.TRACKING.HEADER_CLASS
    },
    children: [
      uiObj(ELEMENT_TYPES.PARAGRAPH, {
        text: isMain(gridType) ? GRID.MAIN.HEADER : GRID.TRACKING.HEADER
      })
    ]
  });

/**
 * Creates a single cell Object for the grid.
 *
 * @param {string} row String identifier for the row.
 * @param {string} col String identifier for the column.
 * @param {string} gridType Grid to create cell for.
 * @returns {Object} Contains details for creating the grid's cell Element.
 */
const gridCellObj = (row, col, gridType) => {
  const isMainResult = isMain(gridType);
  return uiObj(isMainResult ? ELEMENT_TYPES.DIV : ELEMENT_TYPES.BUTTON, {
    attributes: {
      class: GRID.CELL_CLASS,
      ...(!isMainResult && { value: GRID.TRACKING.VALUE(row, col) }),
      ...(!isMainResult && { ...GRID.CELL_STATUS_DATA('unexplored') }),
      ...(isMainResult && { ...GRID.COORDINATES_DATA(row, col) })
    }
  });
};

/**
 * Generates a sequence of Objects for labeling the grid.
 *
 * @param {number} count Number of label objects to generate.
 * @param {string} type Type of label to generate (numeric or letter).
 * @param {string} axisLabelClass Class to add to label object.
 * @returns {Object} Contains details for creating the labels Element.
 */
const generateLabels = (count, type, axisLabelClass) =>
  Array.from({ length: count }).map((_, i) =>
    uiObj(ELEMENT_TYPES.PARAGRAPH, {
      text: type === 'letter' ? getLetter(i) : `${i}`,
      attributes: { class: axisLabelClass }
    })
  );

/**
 * Creates the grid's column's labels.
 *
 * @param {number} cols Number of columns to create labels for.
 * @param {string} letterAxis Axis to label with letters.
 * @returns {Object} Contains details for creating the column label Element.
 */
const colLabelsObj = (cols, letterAxis) =>
  uiObj(ELEMENT_TYPES.DIV, {
    attributes: { class: GRID.LABELS.COL_CONTAINER_CLASS },
    children:
      letterAxis === 'col'
        ? generateLabels(cols, 'letter', GRID.LABELS.COL_CLASS)
        : generateLabels(cols, 'numeric', GRID.LABELS.COL_CLASS)
  });

/**
 * Creates the label for the grid's row.
 *
 * @param {string} label Label given to the row.
 * @returns {Object} Contains details for creating the row label Element.
 */
const boardRowLabelObj = (label) =>
  uiObj(ELEMENT_TYPES.PARAGRAPH, {
    text: label,
    attributes: { class: GRID.LABELS.ROW_CLASS }
  });

/**
 * Creates an individual row for the grid.
 *
 * @param {string} rowLabel Label given to the row.
 * @param {number} cols Number of columns to add to the row.
 * @param {string[]} colLabels Labels for the column (to set the attribute values).
 * @param {string} gridType Grid to create the rows for.
 * @returns {Object} Contains details for creating the row Element.
 */
const buildGridRowObj = (rowLabel, cols, colLabels, gridType) => {
  const cellObjs = Array.from({ length: cols }).map((_, col) =>
    gridCellObj(rowLabel, colLabels[col], gridType)
  );
  const rowLabelObj = boardRowLabelObj(rowLabel);
  return uiObj(ELEMENT_TYPES.DIV, {
    attributes: { class: GRID.ROW_CLASS },
    children: [rowLabelObj, ...cellObjs]
  });
};

/**
 * Creates the specified grid's structured object.
 * Used to create the interface element.
 *
 * @param {number} rows Number of rows the grid should contain.
 * @param {number} cols Number of columns the grid should contain.
 * @param {string} letterAxis The axis to label with letters.
 * @param {string} gridType Type of grid to build.
 * @returns {Object} Complete structured grid object to be built into an HTML Element.
 */

export const buildGridObj = (rows, cols, letterAxis, gridType) => {
  const columnLabelObjectArray = colLabelsObj(cols, letterAxis);
  const columnLabelValues = columnLabelObjectArray.children.map((labelObj) => labelObj.text);
  const rowObjs = Array.from({ length: rows }).map((_, row) =>
    buildGridRowObj(
      letterAxis === 'row' ? getLetter(row) : `${row}`,
      cols,
      columnLabelValues,
      gridType
    )
  );
  return uiObj(ELEMENT_TYPES.DIV, {
    attributes: {
      class: gridType === GRID.TYPES.MAIN ? GRID.MAIN.WRAPPER_CLASS : GRID.TRACKING.WRAPPER_CLASS
    },
    children: [
      uiObj(ELEMENT_TYPES.DIV, {
        type: ELEMENT_TYPES.DIV,
        attributes: { class: gridType },
        children: [gridHeaderObj(gridType), colLabelsObj(cols, letterAxis), ...rowObjs]
      })
    ]
  });
};
