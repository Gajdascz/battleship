import { buildShipUIObj } from './buildShipUIObj';
import './ship-styles.css';

export const ShipView = ({ name, length }) => {
  const { mainShipElement, trackingShipElement, rotateButtonElement } = buildShipUIObj({
    name,
    length
  });

  return {
    elements: {
      getMainShip: () => mainShipElement,
      getTrackingShip: () => trackingShipElement,
      getRotateButton: () => rotateButtonElement
    }
  };
};
