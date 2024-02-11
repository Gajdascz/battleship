import { FleetModel } from '../../components/Fleet/FleetModel';
import { FleetView } from '../../components/Fleet/FleetView';
import { FleetController } from '../../components/Fleet/FleetController';
import { buildFleetUIObj } from './buildFleetUIObj';

export const buildFleetComponent = () => {
  const _fleetUIObj = buildFleetUIObj();
  const _model = FleetModel();
  const _view = FleetView(_fleetUIObj.mainElement, _fleetUIObj.trackingElement);
  const _controller = FleetController(_model, _view);

  return _controller;
};
