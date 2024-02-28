import { TrackingGridModel } from './model/TrackingGridModel';
import { TrackingGridView } from './view/TrackingGridView';

export const TrackingGridController = (scope, { numberOfRows, numberOfCols, letterAxis }) => {
  const model = TrackingGridModel(scope, { numberOfRows, numberOfCols, letterAxis });
  const view = TrackingGridView({ numberOfRows, numberOfCols, letterAxis });
  const displayGrid = (container) => view.renderGrid(container);

  return {
    getModel: () => model,
    getView: () => view,
    initializeStateManagement: () => {}
  };
};
