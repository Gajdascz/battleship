import { ELEMENT_TYPES } from '../../../common/constants/baseConstants';
import { SHIP } from '../../../common/constants/shipConstants';
import { buildUIObj, buildElementFromUIObj } from '../../../common/utility/uiBuilders';

const buildBaseShipUIObj = (name, id, type) =>
  buildUIObj(type, {
    attributes: {
      class: `${id} ${SHIP.CLASSES.ENTRY}`,
      ...{ [SHIP.DATA.NAME]: id },
      ...{ [SHIP.DATA.SUNK]: 'false' }
    },
    children: [
      buildUIObj(ELEMENT_TYPES.PARAGRAPH, {
        text: name,
        attributes: { class: SHIP.CLASSES.SHIP_NAME }
      })
    ]
  });

const extendBaseForInteractivity = (baseObj, length) => {
  baseObj.attributes[SHIP.DATA.LENGTH] = length;
  baseObj.attributes[SHIP.DATA.ORIENTATION] = SHIP.ORIENTATIONS.VERTICAL;
  baseObj.attributes[SHIP.DATA.PLACED] = 'false';
  baseObj.children.push(
    buildUIObj(ELEMENT_TYPES.PARAGRAPH, {
      text: length,
      attributes: { class: SHIP.CLASSES.LENGTH }
    })
  );
  return baseObj;
};

export const buildShipUIObj = (name, length) => {
  const id = name.toLowerCase().replace(/ /g, '-');
  const interactiveShipBaseObj = buildBaseShipUIObj(name, id, ELEMENT_TYPES.BUTTON);
  const trackingShipBaseObj = buildBaseShipUIObj(name, id, ELEMENT_TYPES.DIV);
  const interactiveShipExtendedObj = extendBaseForInteractivity(interactiveShipBaseObj, length);
  const interactiveShipElement = buildElementFromUIObj(interactiveShipExtendedObj);
  const trackingShipElement = buildElementFromUIObj(trackingShipBaseObj);
  return {
    mainElement: interactiveShipElement,
    trackingElement: trackingShipElement,
    id
  };
};
