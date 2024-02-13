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

  const enableSelection = (selectCallback) => {
    _mainShipElement.disabled = false;
    _mainShipElement.addEventListener(MOUSE_EVENTS.CLICK, selectCallback);
  };
  const disableSelection = (selectCallback) => {
    _mainShipElement.disabled = true;
    _mainShipElement.removeEventListener(MOUSE_EVENTS.CLICK, selectCallback);
  };
  const enableOrientationToggle = (toggleOrientationCallback) => {
    document.addEventListener(KEY_EVENTS.DOWN, toggleOrientationCallback);
    document.addEventListener(MOUSE_EVENTS.DOWN, toggleOrientationCallback);
  };
  const disableOrientationToggle = (toggleOrientationCallback) => {
    document.removeEventListener(KEY_EVENTS.DOWN, toggleOrientationCallback);
    document.removeEventListener(MOUSE_EVENTS.DOWN, toggleOrientationCallback);
  };
  return {
    getElement: () => _mainShipElement,
    updateOrientation,
    updatePlacementStatus,
    updateSunkStatus,
    updateSelectedStatus,
    enableSelection,
    disableSelection,
    enableOrientationToggle,
    disableOrientationToggle
  };
};
