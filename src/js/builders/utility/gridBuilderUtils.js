import { COMMON_ELEMENTS } from '../../utility/constants/dom/elements';
import { COMMON_GRID } from '../../utility/constants/components/grids';
import { buildUIObj } from '../utility/uiBuilders';
import { convertIndexToLetter } from '../../utility/utils/stringUtils';

const buildGridHeaderObj = ({ headerClass, headerText }) =>
  buildUIObj(COMMON_ELEMENTS.DIV, {
    attributes: {
      class: headerClass
    },
    children: [
      buildUIObj(COMMON_ELEMENTS.PARAGRAPH, {
        text: headerText
      })
    ]
  });

const getLabelTypes = (letterAxis) =>
  letterAxis === COMMON_GRID.LETTER_AXES.COL
    ? { row: COMMON_GRID.LABEL_TYPES.NUMERIC, col: COMMON_GRID.LABEL_TYPES.LETTER }
    : { row: COMMON_GRID.LABEL_TYPES.LETTER, col: COMMON_GRID.LABEL_TYPES.NUMERIC };

const generateLabels = ({ count, type, axisLabelClass }) =>
  Array.from({ length: count }).map((_, i) =>
    buildUIObj(COMMON_ELEMENTS.PARAGRAPH, {
      text: type === COMMON_GRID.LABEL_TYPES.LETTER ? convertIndexToLetter(i) : `${i}`,
      attributes: { class: axisLabelClass }
    })
  );

const wrapColLabels = ({ labels }) =>
  buildUIObj(COMMON_ELEMENTS.DIV, {
    attributes: { class: COMMON_GRID.CLASSES.LABELS.COL_CONTAINER },
    children: labels
  });

const buildGridCellObj = ({ elementType, attributes }) =>
  buildUIObj(elementType, {
    attributes: {
      class: COMMON_GRID.CLASSES.CELL,
      ...attributes
    }
  });

const buildGridRowObj = ({ rowLabelObj, cellObjs }) =>
  buildUIObj(COMMON_ELEMENTS.DIV, {
    attributes: { class: COMMON_GRID.CLASSES.ROW },
    children: [rowLabelObj, ...cellObjs]
  });

export {
  generateLabels,
  getLabelTypes,
  buildGridHeaderObj,
  buildGridCellObj,
  buildGridRowObj,
  wrapColLabels
};
