import { SHIP_CLASSES } from '../../utility/constants/components/ship';
import { BOOL } from '../../utility/constants/dom/attributes';
import { KEY_EVENTS, MOUSE_EVENTS } from '../../utility/constants/events';
export const ShipView = (shipElement, trackingElement) => {
  const _mainShipElement = shipElement;
  const _trackingShipElement = trackingElement;

  const updateOrientation = (orientation) => (_mainShipElement.dataset.orientation = orientation);

  const updatePlacementStatus = (isPlaced) =>
    (_mainShipElement.dataset.placed = isPlaced ? BOOL.T : BOOL.F);

  const updateSunkStatus = (isSunk) => {
    _mainShipElement.dataset.sunk = isSunk ? BOOL.T : BOOL.F;
    _trackingShipElement.dataset.sunk = isSunk ? BOOL.T : BOOL.F;
  };

  const updateSelectedStatus = (isSelected) =>
    _mainShipElement.classList.toggle(SHIP_CLASSES.SELECTED, isSelected);

  const enableInteractivity = (selectCallback, toggleOrientationCallback) => {
    _mainShipElement.getElement().addEventListener(MOUSE_EVENTS.CLICK, selectCallback);
    document.addEventListener(KEY_EVENTS.DOWN, toggleOrientationCallback);
    document.addEventListener(MOUSE_EVENTS.DOWN, toggleOrientationCallback);
    _mainShipElement.disabled = false;
  };

  const disableInteractivity = () => {
    _view.getElement().removeEventListener(MOUSE_EVENTS.CLICK, select);
    document.removeEventListener(KEY_EVENTS.DOWN, toggleOrientation);
    document.removeEventListener(MOUSE_EVENTS.DOWN, toggleOrientation);
  };

  return {
    getElement: () => _mainShipElement,
    updateOrientation,
    updatePlacementStatus,
    updateSunkStatus,
    updateSelectedStatus,
    enableInteractivity
  };
};
