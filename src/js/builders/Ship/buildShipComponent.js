import { buildShipUIObj } from './buildShipUIObj';
import { ShipModel } from '../../components/Ship/ShipModel';
import { ShipView } from '../../components/Ship/ShipView';
import { ShipController } from '../../components/Ship/ShipController';

export const buildShipComponent = ({ shipName, shipLength }) => {
  const { mainElement, trackingElement, id } = buildShipUIObj(shipName, shipLength);
  const model = ShipModel(id);
  const view = ShipView(mainElement, trackingElement);
  return ShipController(model, view);
};
