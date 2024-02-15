import { CLASSES, DATA_ATTRIBUTES } from '../utility/constants';
import { ORIENTATIONS } from '../../../utility/constants/common';
import { BOOL } from '../../../utility/constants/dom/attributes';
import { COMMON_ELEMENTS } from '../../../utility/constants/dom/elements';
import { buildUIObj, buildElementFromUIObj } from '../../../utility/uiBuilderUtils/uiBuilders';
const buildBaseShipUIObj = (name, id, type) =>
  buildUIObj(type, {
    attributes: {
      class: `${id} ${CLASSES.ENTRY}`,
      ...{ [DATA_ATTRIBUTES.NAME]: id },
      ...{ [DATA_ATTRIBUTES.SUNK]: 'false' }
    },
    children: [
      buildUIObj(COMMON_ELEMENTS.PARAGRAPH, {
        text: name,
        attributes: { class: CLASSES.SHIP_NAME }
      })
    ]
  });

const extendBaseForInteractivity = (baseObj, length) => {
  baseObj.attributes[DATA_ATTRIBUTES.LENGTH] = length;
  baseObj.attributes[DATA_ATTRIBUTES.ORIENTATION] = ORIENTATIONS.VERTICAL;
  baseObj.attributes[DATA_ATTRIBUTES.PLACED] = BOOL.F;
  baseObj.children.push(buildUIObj(COMMON_ELEMENTS.PARAGRAPH, { text: length }));
  return baseObj;
};

export const buildShipUIObj = ({ name, length }) => {
  const id = name.toLowerCase().replace(/ /g, '-');
  const interactiveShipBaseObj = buildBaseShipUIObj(name, id, COMMON_ELEMENTS.BUTTON);
  const trackingShipBaseObj = buildBaseShipUIObj(name, id, COMMON_ELEMENTS.DIV);
  const interactiveShipExtendedObj = extendBaseForInteractivity(interactiveShipBaseObj, length);
  const interactiveShipElement = buildElementFromUIObj(interactiveShipExtendedObj);
  const trackingShipElement = buildElementFromUIObj(trackingShipBaseObj);
  return {
    mainShipElement: interactiveShipElement,
    trackingShipElement
  };
};
