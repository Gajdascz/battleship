import { FleetModel } from './model/FleetModel';
import { FleetView } from './view/FleetView';
import { FleetController } from './FleetController';
import { buildFleetUIObj } from './view/buildFleetUIObj';

export const buildFleetComponent = () => {
  const _fleetUIObj = buildFleetUIObj();
  const _model = FleetModel();
  const _view = FleetView(_fleetUIObj.mainElement, _fleetUIObj.trackingElement);
  const _controller = FleetController(_model, _view);

  return _controller;
};
