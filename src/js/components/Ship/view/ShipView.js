import { SHIP_CLASSES, ROTATE_SHIP_BUTTON } from '../../../utility/constants/components/ship';
import { BOOL } from '../../../utility/constants/dom/attributes';
import { COMMON_ELEMENTS } from '../../../utility/constants/dom/elements';
import { KEY_EVENTS, MOUSE_EVENTS } from '../../../utility/constants/events';
import { buildUIElement } from '../../../utility/uiBuilderUtils/uiBuilders';
import { buildShipUIObj } from './buildShipUIObj';
export const ShipView = ({ name, length }) => {
  const { mainShipElement, trackingShipElement } = buildShipUIObj({ name, length });
  const _rotateButtonElement = buildUIElement(COMMON_ELEMENTS.BUTTON, {
    text: ROTATE_SHIP_BUTTON.TEXT,
    attributes: { class: ROTATE_SHIP_BUTTON.CLASS }
  });
  const updateOrientation = (orientation) => (mainShipElement.dataset.orientation = orientation);

  const updatePlacementStatus = (isPlaced) =>
    (mainShipElement.dataset.placed = isPlaced ? BOOL.T : BOOL.F);

  const updateSunkStatus = (isSunk) => {
    mainShipElement.dataset.sunk = isSunk ? BOOL.T : BOOL.F;
    trackingShipElement.dataset.sunk = isSunk ? BOOL.T : BOOL.F;
  };

  const updateSelectedStatus = (isSelected) =>
    mainShipElement.classList.toggle(SHIP_CLASSES.SELECTED, isSelected);

  const enableRequestSelection = (requestSelectCallback) => {
    mainShipElement.disabled = false;
    mainShipElement.addEventListener(MOUSE_EVENTS.CLICK, requestSelectCallback);
  };
  const disabledRequestSelection = (requestSelectCallback) => {
    mainShipElement.disabled = true;
    mainShipElement.removeEventListener(MOUSE_EVENTS.CLICK, requestSelectCallback);
  };
  const enableOrientationToggle = (toggleOrientationCallback) => {
    document.addEventListener(KEY_EVENTS.DOWN, toggleOrientationCallback);
    document.addEventListener(MOUSE_EVENTS.DOWN, toggleOrientationCallback);
    _rotateButtonElement.addEventListener(MOUSE_EVENTS.CLICK, toggleOrientationCallback);
  };
  const disableOrientationToggle = (toggleOrientationCallback) => {
    document.removeEventListener(KEY_EVENTS.DOWN, toggleOrientationCallback);
    document.removeEventListener(MOUSE_EVENTS.DOWN, toggleOrientationCallback);
    _rotateButtonElement.removeEventListener(MOUSE_EVENTS.CLICK, toggleOrientationCallback);
  };
  const enableRequestPlacement = (requestPlacementCallback) =>
    document.addEventListener(MOUSE_EVENTS.CLICK, requestPlacementCallback);

  const disableRequestPlacement = (requestPlacementCallback) =>
    document.removeEventListener(MOUSE_EVENTS.CLICK, requestPlacementCallback);

  const renderShip = (container) => container?.append(mainShipElement);
  const renderRotateButton = (container) => container?.append(_rotateButtonElement);
  const removeShip = () => mainShipElement.remove();
  const removeRotateButton = () => _rotateButtonElement.remove();

  return {
    renderShip,
    renderRotateButton,
    removeShip,
    removeRotateButton,
    getElement: () => mainShipElement,
    getRotateButtonElement: () => _rotateButtonElement,
    updateOrientation,
    updatePlacementStatus,
    updateSunkStatus,
    updateSelectedStatus,
    enableRequestSelection,
    disabledRequestSelection,
    enableOrientationToggle,
    disableOrientationToggle,
    enableRequestPlacement,
    disableRequestPlacement
  };
};
