import { COMMON_ELEMENTS } from '../../../../../Utility/constants/dom/elements';
import {
  buildUIObj,
  buildElementFromUIObj
} from '../../../../../Utility/uiBuilderUtils/uiBuilders';
import {
  buildGridCellObj,
  buildGridHeaderObj,
  buildGridRowObj,
  generateLabels,
  getLabelTypes,
  wrapColLabels
} from '../../../../../Utility/uiBuilderUtils/gridBuilderUtils';

import { TRACKING_GRID } from '../../common/trackingGridConstants';
import { COMMON_GRID } from '../../../common/gridConstants';
import { STATUSES } from '../../../../../Utility/constants/common';
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
    headerClass: `${TRACKING_GRID.CLASSES.HEADER} ${COMMON_GRID.CLASSES.HEADER}`,
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

  const buildTrackingGridCell = (coordinateAttribute) =>
    buildGridCellObj({
      elementType: TRACKING_GRID.PROPERTIES.CELL_ELEMENT,
      attributes: {
        value: `${coordinateAttribute}`,
        [TRACKING_GRID.PROPERTIES.ATTRIBUTES.CELL_STATUS_DATA]: STATUSES.UNEXPLORED
      }
    });

  const rowObjs = rowLabelObjs.map((rowLabelObj) =>
    buildGridRowObj({
      rowLabelObj,
      cellObjs: colLabelObjs.map((colLabelObj) =>
        buildTrackingGridCell(`${rowLabelObj.text}${colLabelObj.text}`)
      )
    })
  );

  const trackingGridUIObj = buildUIObj(COMMON_ELEMENTS.DIV, {
    attributes: {
      class: `${TRACKING_GRID.CLASSES.WRAPPER} ${COMMON_GRID.CLASSES.WRAPPER}`
    },
    children: [
      buildUIObj(COMMON_ELEMENTS.DIV, {
        attributes: { class: TRACKING_GRID.CLASSES.TYPE },
        children: [headerObj, wrapColLabels({ labels: colLabelObjs }), ...rowObjs]
      })
    ]
  });
  return {
    wrappedTrackingGridElement: buildElementFromUIObj(trackingGridUIObj)
  };
};
