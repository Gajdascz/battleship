import { initializeStateManagement } from '../../../utility/stateManagement/initializeStateManagement';
import { TrackingGridModel } from './model/TrackingGridModel';
import { TrackingGridView } from './view/TrackingGridView';

export const TrackingGridController = (scope, { numberOfRows, numberOfCols, letterAxis }) => {
  const model = TrackingGridModel({ numberOfRows, numberOfCols, letterAxis });
  const view = TrackingGridView({ numberOfRows, numberOfCols, letterAxis });

  const displayGrid = (container) => view.renderGrid(container);

  const getStateBundles = () => [{}];

  return {
    getModel: () => model,
    getView: () => view,
    initializeStateManagement: () =>
      initializeStateManagement({ id: model.getID(), stateBundles: getStateBundles() })
  };
};
