import { COMMON_ELEMENTS } from '../../../utility/constants/dom/elements';
import { TRACKING_GRID, COMMON_GRID } from '../../../utility/constants/components/grids';
import { buildUIObj, buildElementFromUIObj } from '../../../utility/uiBuilderUtils/uiBuilders';
import {
  buildGridCellObj,
  buildGridHeaderObj,
  buildGridRowObj,
  generateLabels,
  getLabelTypes,
  wrapColLabels
} from '../../../utility/uiBuilderUtils/gridBuilderUtils';

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

export const buildTrackingGridUIObj = ({ numberOfRows, numberOfCols, letterAxis }) => {
  const headerObj = buildGridHeaderObj({
    headerClass: TRACKING_GRID.CLASSES.HEADER,
    headerText: TRACKING_GRID.PROPERTIES.HEADER_TEXT
  });
  const labelTypes = getLabelTypes(letterAxis);
  const colLabelObjs = generateLabels({
    count: numberOfCols,
    type: labelTypes.col,
    axisLabelClass: COMMON_GRID.CLASSES.LABELS.COL
  });
  const rowLabelObjs = generateLabels({
    count: numberOfRows,
    type: labelTypes.row,
    axisLabelClass: COMMON_GRID.CLASSES.LABELS.ROW
  });

  const buildMainGridCell = (coordinateAttribute) =>
    buildGridCellObj({
      elementType: TRACKING_GRID.PROPERTIES.CELL_ELEMENT,
      attributes: {
        [TRACKING_GRID.PROPERTIES.ATTRIBUTES.CELL_COORDINATES_DATA]: `${coordinateAttribute}`
      }
    });

  const rowObjs = rowLabelObjs.map((rowLabelObj) =>
    buildGridRowObj({
      rowLabelObj,
      cellObjs: colLabelObjs.map((colLabelObj) =>
        buildMainGridCell(`${rowLabelObj.text}${colLabelObj.text}`)
      )
    })
  );

  const trackingGridUIObj = buildUIObj(COMMON_ELEMENTS.DIV, {
    attributes: {
      class: TRACKING_GRID.CLASSES.WRAPPER
    },
    children: [
      buildUIObj(COMMON_ELEMENTS.DIV, {
        attributes: { class: TRACKING_GRID.TYPE },
        children: [headerObj, wrapColLabels({ labels: colLabelObjs }), ...rowObjs]
      })
    ]
  });
  return {
    wrappedTrackingGridElement: buildElementFromUIObj(trackingGridUIObj)
  };
};