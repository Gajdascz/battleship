import { buildShipUIObj } from './buildShipUIObj';
import { ShipModel } from '../../components/Ship/ShipModel';
import { ShipView } from '../../components/Ship/ShipView';
import { ShipController } from '../../components/Ship/ShipController';

export const buildShipComponent = ({ shipName, shipLength }) => {
  const { mainElement, trackingElement } = buildShipUIObj(shipName, shipLength);
  const model = ShipModel({ length: shipLength, name: shipName });
  const view = ShipView(mainElement, trackingElement);
  const controller = ShipController({ model, view });
  controller.initializeStateManager();
  controller.registerStateManager();
  return controller;
};
