import { ShipModel } from './model/ShipModel';
import { ShipView } from './view/ShipView';
import { initializeSateManagement } from '../../utility/stateManagement/initializeStateManagement';
import { bundleComponentStates } from './utility/bundleComponentStates';

import { STATUSES } from '../../utility/constants/common';
import { publish } from './utility/publishers';
import { buildPlacementManager } from './utility/buildPlacementManager';

export const ShipController = ({ name, length }) => {
  const model = ShipModel({ name, length });
  const view = ShipView({ name, length });
  const _placementManager = buildPlacementManager(model, view);

  const hit = () => {
    const result = model.hit();
    if (result === STATUSES.SHIP_SUNK) {
      view.updateSunkStatus(true);
      publish.shipSunk(model.getID());
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
    getModel: () => model,
    getElement: () => view.getElement(),
    getRotateButtonElement: () => view.getRotateButtonElement(),
    renderRotateButton: (container) => view.renderRotateButton(container),
    removeRotateButton: () => view.removeRotateButton(),
    renderShip: (container) => view.renderShip(container),
    removeShip: () => view.removeShip(),
    getID: () => model.getID(),
    initializeStateManagement: () =>
      initializeSateManagement({ id: model.getID(), stateBundles: getStateBundles() })
  };
};
