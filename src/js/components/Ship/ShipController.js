import { STATUSES } from '../../utility/constants/common';
import { handle } from './utility/controllerHandlers';

export const ShipController = (shipModel, shipView) => {
  const _model = shipModel;
  const _view = shipView;
  const updateView = () => _view.render(shipModel);

  const select = () => {
    if (!_model.isPlacementState()) return;
    if (_model.isSelected()) pickup();
    _model.setIsSelected(true);
    handle.placementState.shipSelect(_view, _model);
    updateView();
  };
  const deselect = () => {
    if (!_model.isPlacementState()) return;
    _model.setIsSelected(false);
    updateView();
  };
  const pickup = () => {
    _model.setPlacedCoordinates([]);
    _model.setIsPlaced(false);
    updateView();
  };

  const setToPlacementState = () => {
    if (_model.isPlacementState()) return;
    handle.placementState.initiate(_model);
    updateView();
  };
  const setToProgressState = () => {
    if (_model.isProgressState()) return;
    _view.updateForProgressState();
    handle.progressState.initiate(_model);
    updateView();
  };
  const hitShip = () => {
    if (!_model.isProgressState()) return;
    const result = _model.hit();
    if (result === STATUSES.SHIP_SUNK) handle.progressState.shipSunk();
    else handle.progressState.shipHit();
    updateView();
  };

  return {
    setToPlacementState,
    select,
    deselect,
    setToProgressState,
    hitShip,
    getModel: () => _model,
    getElement: () => _view.getElement()
  };
};
