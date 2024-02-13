import { SHIP_CLASSES, SHIP_DATA_ATTRIBUTES } from '../../utility/constants/components/ship';
import { buildUIObj, buildElementFromUIObj } from '../utility/uiBuilders';
import { ORIENTATIONS } from '../../utility/constants/common';
import { BOOL } from '../../utility/constants/dom/attributes';
import { COMMON_ELEMENTS } from '../../utility/constants/dom/elements';

const buildBaseShipUIObj = (name, id, type) =>
  buildUIObj(type, {
    attributes: {
      class: `${id} ${SHIP_CLASSES.ENTRY}`,
      ...{ [SHIP_DATA_ATTRIBUTES.NAME]: id },
      ...{ [SHIP_DATA_ATTRIBUTES.SUNK]: 'false' }
    },
    children: [
      buildUIObj(COMMON_ELEMENTS.PARAGRAPH, {
        text: name,
        attributes: { class: SHIP_CLASSES.SHIP_NAME }
      })
    ]
  });

const extendBaseForInteractivity = (baseObj, length) => {
  baseObj.attributes[SHIP_DATA_ATTRIBUTES.LENGTH] = length;
  baseObj.attributes[SHIP_DATA_ATTRIBUTES.ORIENTATION] = ORIENTATIONS.VERTICAL;
  baseObj.attributes[SHIP_DATA_ATTRIBUTES.PLACED] = BOOL.F;
  baseObj.children.push(buildUIObj(COMMON_ELEMENTS.PARAGRAPH, { text: length }));
  return baseObj;
};

export const buildShipUIObj = (name, length) => {
  const id = name.toLowerCase().replace(/ /g, '-');
  const interactiveShipBaseObj = buildBaseShipUIObj(name, id, COMMON_ELEMENTS.BUTTON);
  const trackingShipBaseObj = buildBaseShipUIObj(name, id, COMMON_ELEMENTS.DIV);
  const interactiveShipExtendedObj = extendBaseForInteractivity(interactiveShipBaseObj, length);
  const interactiveShipElement = buildElementFromUIObj(interactiveShipExtendedObj);
  const trackingShipElement = buildElementFromUIObj(trackingShipBaseObj);
  return {
    mainElement: interactiveShipElement,
    trackingElement: trackingShipElement
  };
};
