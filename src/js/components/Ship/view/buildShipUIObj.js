import { SHIP_CLASSES, SHIP_DATA_ATTRIBUTES, SHIP_ROTATE_BUTTON } from '../utility/constants';
import { ORIENTATIONS } from '../../../utility/constants/common';
import { BOOL } from '../../../utility/constants/dom/attributes';
import { COMMON_ELEMENTS } from '../../../utility/constants/dom/elements';
import { buildUIObj, buildElementFromUIObj } from '../../../utility/uiBuilderUtils/uiBuilders';
const buildBaseShipUIObj = (name, id, type) =>
  buildUIObj(type, {
    attributes: {
      class: `${id} ${SHIP_CLASSES.ENTRY}`,
      ...{ [SHIP_DATA_ATTRIBUTES.SHIP_NAME]: id },
      ...{ [SHIP_DATA_ATTRIBUTES.SHIP_SUNK]: 'false' }
    },
    children: [
      buildUIObj(COMMON_ELEMENTS.PARAGRAPH, {
        text: name,
        attributes: { class: SHIP_CLASSES.NAME }
      })
    ]
  });

const extendBaseForInteractivity = (baseObj, length) => {
  baseObj.attributes[SHIP_DATA_ATTRIBUTES.SHIP_LENGTH] = length;
  baseObj.attributes[SHIP_DATA_ATTRIBUTES.SHIP_ORIENTATION] = ORIENTATIONS.VERTICAL;
  baseObj.attributes[SHIP_DATA_ATTRIBUTES.SHIP_PLACED] = BOOL.F;
  baseObj.children.push(buildUIObj(COMMON_ELEMENTS.PARAGRAPH, { text: length }));
  return baseObj;
};
const buildRotateButtonUIObj = () =>
  buildUIObj(COMMON_ELEMENTS.BUTTON, {
    text: SHIP_ROTATE_BUTTON.TEXT,
    attributes: { class: SHIP_ROTATE_BUTTON.CLASS }
  });

export const buildShipUIObj = ({ name, length }) => {
  const id = name.toLowerCase().replace(/ /g, '-');
  const interactiveShipBaseObj = buildBaseShipUIObj(name, id, COMMON_ELEMENTS.BUTTON);
  const trackingShipBaseObj = buildBaseShipUIObj(name, id, COMMON_ELEMENTS.DIV);
  const interactiveShipExtendedObj = extendBaseForInteractivity(interactiveShipBaseObj, length);
  const interactiveShipElement = buildElementFromUIObj(interactiveShipExtendedObj);
  const trackingShipElement = buildElementFromUIObj(trackingShipBaseObj);
  const rotateButtonElement = buildElementFromUIObj(buildRotateButtonUIObj());
  return {
    mainShipElement: interactiveShipElement,
    trackingShipElement,
    rotateButtonElement
  };
};
