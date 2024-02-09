import { buildShipUIObj } from './buildShipUIObj';
import { ShipModel } from '../../Ship/ShipModel';
import { ShipView } from '../../Ship/ShipView';
import { ShipController } from '../../Ship/ShipController';

export const buildShipComponent = ({ shipName, shipLength }) => {
  const { mainElement, trackingElement, id } = buildShipUIObj(shipName, shipLength);
  const model = ShipModel(id);
  const view = ShipView(mainElement, trackingElement);
  return ShipController(model, view);
};
