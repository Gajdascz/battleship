import { PLACEMENT_EVENTS } from '../../utility/constants/events';
import { STATES } from '../../utility/constants/common';
import { StateManager } from '../../utility/stateManagement/StateManager';
import { StateBundler } from '../../utility/stateManagement/StateBundler';
import stateManagerRegistry from '../../utility/stateManagement/stateManagerRegistry';

export const MainGridController = ({ model, view }) => {
  const _model = model;
  const _view = view;
  const _stateManager = StateManager(_model.getID());

  const initPreviewManager = () => {
    _view.initializePreviewManager({
      maxVertical: _model.getMaxVertical(),
      maxHorizontal: _model.getMaxHorizontal(),
      letterAxis: _model.getLetterAxis()
    });
  };

  const updateShipPreview = (detail) => {
    console.log(detail);
    const { length, orientation } = detail;
    _view.updateShipPreview({ length, orientation });
  };

  const initializeStateManager = () => {
    const bundler = StateBundler();
    bundler.addSubscriptionToState(STATES.PLACEMENT, {
      event: PLACEMENT_EVENTS.SHIP.SELECTED,
      callback: updateShipPreview
    });
    bundler.addExecuteFnToState(STATES.PLACEMENT, initPreviewManager);
    bundler.addSubscriptionToState(STATES.PLACEMENT, {
      event: PLACEMENT_EVENTS.SHIP.ORIENTATION_CHANGED,
      callback: updateShipPreview
    });
    const bundles = bundler.getBundles();
    bundles.forEach((bundle) => _stateManager.storeState(bundle));
  };

  return {
    displayGrid: (container) => _view.renderGrid(container),
    initializeStateManager,
    registerStateManager: () => stateManagerRegistry.registerManager(_stateManager)
  };
};
