import { COMMON_ELEMENTS } from '../../utility/constants/dom/elements';
import { MAIN_GRID, TRACKING_GRID, COMMON_GRID } from '../../utility/constants/components/grids';
import { buildUIObj } from '../utility/uiBuilders';
import { STATUSES } from '../../utility/constants/common';
import { convertIndexToLetter, convertLetterToIndex } from '../../utility/utils/stringUtils';
/**
 * @module buildGridObj.js
 * Provides the structured Object for the game board's specified grid.
 * This object should be built into an HTML Element and provides the fundamental interface
 * for playing Battleship.
 *
 * Expected gridType includes: 'main-grid' or 'tracking-grid'
 *
 */

const isMain = (gridType) => gridType === MAIN_GRID.TYPE;

/**
 * Creates the grid's header Object.
 *
 * @param {string} gridType Grid to create header for.
 * @returns {Object} Contains details for creating the grid's header Element.
 */
const gridHeaderObj = (gridType) =>
  buildUIObj(COMMON_ELEMENTS.DIV, {
    attributes: {
      class: isMain(gridType) ? MAIN_GRID.CLASSES.HEADER : TRACKING_GRID.CLASSES.HEADER
    },
    children: [
      buildUIObj(COMMON_ELEMENTS.PARAGRAPH, {
        text: isMain(gridType)
          ? MAIN_GRID.PROPERTIES.HEADER_TEXT
          : TRACKING_GRID.PROPERTIES.HEADER_TEXT
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

  return buildUIObj(isMainResult ? COMMON_ELEMENTS.DIV : COMMON_ELEMENTS.BUTTON, {
    attributes: {
      class: COMMON_GRID.CLASSES.CELL,
      ...(!isMainResult && { [TRACKING_GRID.PROPERTIES.ATTRIBUTES.VALUE]: `${row + col}` }),
      ...(!isMainResult && {
        [TRACKING_GRID.PROPERTIES.ATTRIBUTES.CELL_STATUS_DATA]: STATUSES.UNEXPLORED
      }),
      ...(isMainResult && {
        [MAIN_GRID.PROPERTIES.ATTRIBUTES.CELL_COORDINATES_DATA]: `${row + col}`
      })
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
    buildUIObj(COMMON_ELEMENTS.PARAGRAPH, {
      text: type === COMMON_GRID.LABEL_TYPES.LETTER ? convertIndexToLetter(i) : `${i}`,
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
  buildUIObj(COMMON_ELEMENTS.DIV, {
    attributes: { class: COMMON_GRID.CLASSES.LABELS.COL_CONTAINER },
    children:
      letterAxis === COMMON_GRID.LETTER_AXES.COL
        ? generateLabels(cols, COMMON_GRID.LABEL_TYPES.LETTER, COMMON_GRID.CLASSES.LABELS.COL)
        : generateLabels(cols, COMMON_GRID.LABEL_TYPES.NUMERIC, COMMON_GRID.CLASSES.LABELS.COL)
  });

/**
 * Creates the label for the grid's row.
 *
 * @param {string} label Label given to the row.
 * @returns {Object} Contains details for creating the row label Element.
 */
const boardRowLabelObj = (label) =>
  buildUIObj(COMMON_ELEMENTS.PARAGRAPH, {
    text: label,
    attributes: { class: COMMON_GRID.CLASSES.LABELS.ROW }
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
  return buildUIObj(COMMON_ELEMENTS.DIV, {
    attributes: { class: COMMON_GRID.CLASSES.ROW },
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
      letterAxis === COMMON_GRID.LETTER_AXES.ROW ? convertLetterToIndex(row) : `${row}`,
      cols,
      columnLabelValues,
      gridType
    )
  );
  return buildUIObj(COMMON_ELEMENTS.DIV, {
    attributes: {
      class: gridType === MAIN_GRID.TYPE ? MAIN_GRID.CLASSES.WRAPPER : TRACKING_GRID.CLASSES.WRAPPER
    },
    children: [
      buildUIObj(COMMON_ELEMENTS.DIV, {
        attributes: { class: gridType },
        children: [gridHeaderObj(gridType), colLabelsObj(cols, letterAxis), ...rowObjs]
      })
    ]
  });
};
