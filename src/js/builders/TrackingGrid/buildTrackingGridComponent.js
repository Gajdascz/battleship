import { buildTrackingGridUIObj } from './buildTrackingGridUIObj';
import { TrackingGridModel } from '../../components/TrackingGrid/TrackingGridModel';
import { TrackingGridView } from '../../components/TrackingGrid/TrackingGridView';
import { TrackingGridController } from '../../components/TrackingGrid/TrackingGridController';

export const buildTrackingGridComponent = (gridConfig) => {
  const trackingGridUIObj = buildTrackingGridUIObj(gridConfig);
  const model = TrackingGridModel(gridConfig);
  const view = TrackingGridView(trackingGridUIObj.element);
  const controller = TrackingGridController(model, view);
  return controller;
};
