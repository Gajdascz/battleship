import { STATES, STATUSES } from '../../utility/constants/common';
import { KEY_EVENTS, PLACEMENT_EVENTS, PROGRESS_EVENTS } from '../../utility/constants/events';
import { publish } from './utility/publishers';
import { StateManager } from '../../utility/stateManagement/StateManager';
import { CreateStateBundler } from '../../utility/stateManagement/CreateStateBundler';
import stateManagerRegistry from '../../utility/stateManagement/stateManagerRegistry';

export const ShipController = ({ model, view }) => {
  const _model = model;
  const _view = view;
  const _stateManager = StateManager(_model.getID());

  const enableInteractivity = () => {
    _view.enableSelection(select);
  };
  const disableInteractivity = () => {
    _view.disableSelection(select);
    _view.disableOrientationToggle(toggleOrientation);
  };

  const select = () => {
    _view.enableOrientationToggle(toggleOrientation);
    if (_model.isSelected()) pickup();
    _model.setIsSelected(true);
    _view.updateSelectedStatus(true);
    publish.shipSelected({
      element: _view.getElement(),
      length: _model.getLength(),
      id: _model.getID(),
      orientation: _model.getOrientation()
    });
  };

  const deselect = () => {
    _view.disableOrientationToggle(toggleOrientation);
    _model.setIsSelected(false);
    _view.updateSelectedStatus(false);
  };

  const toggleOrientation = (e) => {
    const isRotateRequest = (e) =>
      e.code === KEY_EVENTS.CODES.SPACE ||
      e.code === KEY_EVENTS.CODES.R ||
      e.button === 1 ||
      (e.target.classList.contains('rotate-ship-button') && e instanceof PointerEvent);
    if (!isRotateRequest(e)) return;
    e.preventDefault();
    _model.toggleOrientation();
    _view.updateOrientation(_model.getOrientation());
    publish.orientationToggled(_model.getID(), _model.getOrientation());
  };

  const place = (coordinates) => {
    _model.setPlacedCoordinates(coordinates);
    _model.setIsPlaced(true);
    _view.updatePlacementStatus(true);
    publish.placementSuccessful();
  };

  const pickup = () => {
    _model.setPlacedCoordinates([]);
    _model.setIsPlaced(false);
    _view.updatePlacementStatus(false);
  };

  const hit = () => {
    const result = _model.hit();
    if (result === STATUSES.SHIP_SUNK) {
      _view.updateSunkStatus(true);
      publish.shipSunk(_model.getID());
    }
  };

  const handleAttack = ({ coordinates }) => {};

  const initializeStateManager = () => {
    const stateBundler = CreateStateBundler();
    stateBundler.addExecuteFnToState(STATES.PLACEMENT, enableInteractivity);
    stateBundler.addSubscriptionToState(STATES.PLACEMENT, {
      event: PLACEMENT_EVENTS.SHIP.PLACED,
      callback: place
    });
    stateBundler.addExecuteFnToState(STATES.PROGRESS, disableInteractivity);
    stateBundler.addSubscriptionToState(STATES.PROGRESS, {
      event: PROGRESS_EVENTS.ATTACK.INITIATED,
      callback: handleAttack
    });
    const bundles = stateBundler.getBundles();
    bundles.forEach((bundle) => _stateManager.storeState(bundle));
  };

  return {
    select,
    deselect,
    getModel: () => _model,
    getElement: () => _view.getElement(),
    initializeStateManager,
    registerStateManager: () => stateManagerRegistry.registerManager(_stateManager)
  };
};
