import { ELEMENT_TYPES, SHIP } from '../common/uiConstants';
import { uiObj, uiObjToElement } from '../common/uiUtility';
import { ORIENTATION } from '../../utility/constants';

const isInteractive = (type) => type === ELEMENT_TYPES.BUTTON;

const buildShipObj = (length, name, type = ELEMENT_TYPES.DIV) => {
  const cleanName = name.toLowerCase().replace('/ /g', '-');
  return uiObj(type, {
    attributes: {
      class: `${cleanName} ${SHIP.CLASSES.ENTRY}`,
      ...SHIP.DATA.NAME(cleanName),
      ...SHIP.DATA.SUNK(),
      ...(isInteractive(type) && {
        ...SHIP.DATA.LENGTH(length),
        ...SHIP.DATA.ORIENTATION(),
        ...SHIP.DATA.PLACED()
      })
    },
    children: [
      uiObj(ELEMENT_TYPES.PARAGRAPH, { text: name, attributes: { class: SHIP.CLASSES.SHIP_NAME } }),
      ...(isInteractive(type) && [
        uiObj(ELEMENT_TYPES.PARAGRAPH, { text: length, attributes: { class: SHIP.CLASSES.LENGTH } })
      ])
    ]
  });
};

export const ShipController = (length, name, type = ELEMENT_TYPES.DIV) => {
  const shipElement = uiObjToElement(buildShipObj(length, name, type));

  // Placement State Methods
  const toggleOrientation = () => {
    const currentOrientation = shipElement.dataset.orientation;
    shipElement.dataset.orientation =
      currentOrientation === ORIENTATION.VERTICAL ? ORIENTATION.HORIZONTAL : ORIENTATION.VERTICAL;
  };
  const selectForPlacement = () => shipElement.classList.toggle(SHIP.CLASSES.BEING_PLACED);
  const setPlaced = () => {
    shipElement.classList.toggle(SHIP.CLASSES.BEING_PLACED);
    shipElement.dataset.placed = true;
  };
  const unsetPlaced = () => (shipElement.dataset.placed = false);

  return {
    setSunk: () => (shipElement.dataset.sunk = true),
    clearPlacementStateMethods: () => {}
  };
};
