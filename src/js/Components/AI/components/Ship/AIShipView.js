import { buildUIObj, buildElementFromUIObj } from '../../../../Utility/uiBuilderUtils/uiBuilders';
import { COMMON_ELEMENTS } from '../../../../Utility/constants/dom/elements';
import { SHIP_CLASSES, SHIP_DATA_ATTRIBUTES } from '../../../Ship/common/shipConstants';
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

export const AIShipView = (name) => {
  const id = name.toLowerCase().replace(/ /g, '-');
  const trackingShipBaseObj = buildBaseShipUIObj(name, id, COMMON_ELEMENTS.DIV);
  const trackingShipElement = buildElementFromUIObj(trackingShipBaseObj);
  return {
    getShipElement: () => trackingShipElement
  };
};
