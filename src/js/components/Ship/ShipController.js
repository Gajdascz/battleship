import { STATUSES } from '../../utility/constants/common';
import { publish } from './utility/publishers';
import { bundleComponentStates } from './utility/bundleComponentStates';
import { buildPlacementManager } from './utility/buildPlacementManager';

import { initializeSateManagement } from '../../utility/stateManagement/initializeStateManagement';

export const ShipController = ({ model, view }) => {
  const _model = model;
  const _view = view;
  const _placementManager = buildPlacementManager(model, view);

  const hit = () => {
    const result = _model.hit();
    if (result === STATUSES.SHIP_SUNK) {
      _view.updateSunkStatus(true);
      publish.shipSunk(_model.getID());
    }
  };

  const handleAttack = ({ coordinates }) => {
    hit();
  };

  const getStateBundles = () =>
    bundleComponentStates({
      enablePlacementSettings: _placementManager.enablePlacementSettings,
      disablePlacementSettings: _placementManager.disablePlacementSettings,
      requestSelect: _placementManager.handleSelectRequest,
      handlePlacement: _placementManager.handlePlacement,
      handleAttack
    });

  return {
    getModel: () => _model,
    getElement: () => _view.getElement(),
    getRotateButtonElement: () => _view.getRotateButtonElement(),
    renderRotateButton: (container) => _view.renderRotateButton(container),
    removeRotateButton: () => _view.removeRotateButton(),
    renderShip: (container) => _view.renderShip(container),
    removeShip: () => _view.removeShip(),
    getID: () => _model.getID(),
    initializeStateManagement: () =>
      initializeSateManagement({ id: _model.getID(), stateBundles: getStateBundles() })
  };
};
