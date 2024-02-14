import { COMMON_GRID } from '../../utility/constants/components/grids';
import { MOUSE_EVENTS } from '../../utility/constants/events';
import { initializeSateManagement } from '../../utility/stateManagement/initializeStateManagement';

export const TrackingGridController = (trackingGridModel, trackingGridView) => {
  const _model = trackingGridModel;
  const _view = trackingGridView;

  const displayGrid = (container) => _view.renderGrid(container);

  const getStateBundles = () => [{}];

  return {
    displayGrid,
    initializeStateManagement: () =>
      initializeSateManagement({ id: _model.getID(), stateBundles: getStateBundles() })
  };
};
