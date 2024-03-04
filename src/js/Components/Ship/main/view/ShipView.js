import { buildShipUIObj } from './buildShipUIObj';
import './ship-styles.css';

const ELEMENT_IDS = {
  MAIN_SHIP: 'mainShip',
  TRACKING_SHIP: 'trackingShip',
  ROTATE_BUTTON: 'rotateButton'
};
export const ShipView = ({ name, length }) => {
  const { mainShipElement, trackingShipElement, rotateButtonElement } = buildShipUIObj({
    name,
    length
  });

  return {
    elements: {
      getMainShip: () => ({ id: ELEMENT_IDS.MAIN_SHIP, element: mainShipElement }),
      getTrackingShip: () => ({ id: ELEMENT_IDS.TRACKING_SHIP, element: trackingShipElement }),
      getRotateButton: () => ({ id: ELEMENT_IDS.ROTATE_BUTTON, element: rotateButtonElement })
    }
  };
};
