import { STATUSES } from '../../utility/constants/common';
import {
  MOUSE_EVENTS,
  KEY_EVENTS,
  PLACEMENT_EVENTS,
  PROGRESS_EVENTS
} from '../../utility/constants/events';
import eventEmitter from '../../utility/eventEmitter';

const isRotateRequest = (e) =>
  e.code === KEY_EVENTS.CODES.SPACE ||
  e.code === KEY_EVENTS.CODES.R ||
  e.button === 1 ||
  (e.target.classList.contains('rotate-ship-button') && e instanceof PointerEvent);

export const ShipController = ({ shipModel, shipView }) => {
  const _model = shipModel;
  const _view = shipView;

  const interactivityControl = {
    enable: () => {
      _view.getElement().addEventListener(MOUSE_EVENTS.CLICK, select);
      document.addEventListener(KEY_EVENTS.DOWN, toggleOrientation);
      document.addEventListener(MOUSE_EVENTS.DOWN, toggleOrientation);
      _view.getElement().disabled = true;
    },
   
  };

  const disableShipSelection = () =>
    _view.getElement().removeEventListener(MOUSE_EVENTS.CLICK, select);
  const disableShipOrientationToggle = () => {
    document.removeEventListener(KEY_EVENTS.DOWN, toggleOrientation);
    document.removeEventListener(MOUSE_EVENTS.DOWN, toggleOrientation);
  };
  const enableInteractivity = () => {
  };

  const disableInteractivity = () => {
    disableShipSelection();
    disableShipOrientationToggle();
    _view.getElement().disabled = true;
  };

  }


  const select = () => {
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
    _model.setIsSelected(false);
    _view.updateSelectedStatus(false);
  };

  const toggleOrientation = (e) => {
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
    } else {
      publish.shipHit(_model.getID());
    }
  };

  const handleAttack = ({ coordinates }) => {};

  return {
    select,
    deselect,
    getModel: () => _model,
    getElement: () => _view.getElement()
  };
};
