import { buildMainGridUIObj } from './buildMainGridUIObj';
import { MainGridModel } from '../../components/MainGrid/MainGridModel';
import { MainGridView } from '../../components/MainGrid/MainGridView';
import { MainGridController } from '../../components/MainGrid/MainGridController';

export const buildMainGridComponent = (gridConfig) => {
  const mainGridObj = buildMainGridUIObj(gridConfig);
  const model = MainGridModel(gridConfig);
  const view = MainGridView(mainGridObj.element);
  const controller = MainGridController({ model, view });
  return controller;
};
