import { SHIP_CLASSES } from '../../../utility/constants/components/ship';
import { BOOL } from '../../../utility/constants/dom/attributes';
import { KEY_EVENTS, MOUSE_EVENTS } from '../../../utility/constants/events';
import { buildShipUIObj } from './buildShipUIObj';
export const ShipView = ({ name, length }) => {
  const { mainShipElement, trackingShipElement, rotateButtonElement } = buildShipUIObj({
    name,
    length
  });
  const isValidCallback = (callback) => {
    if (callback && typeof callback === 'function') return true;
    console.warn('Callback not set or is invalid.');
    return false;
  };
  const elements = {
    mainShip: mainShipElement,
    trackingShip: trackingShipElement,
    rotateButton: rotateButtonElement
  };
  const update = {
    orientation: (newOrientation) => (mainShipElement.dataset.orientation = newOrientation),
    selectedStatus: (isSelected) =>
      mainShipElement.classList.toggle(SHIP_CLASSES.SELECTED, isSelected),
    placementStatus: (isPlaced) => (mainShipElement.dataset.placed = isPlaced ? BOOL.T : BOOL.F),
    sunkStatus: (isSunk) => {
      mainShipElement.dataset.sunk = isSunk ? BOOL.T : BOOL.F;
      trackingShipElement.dataset.sunk = isSunk ? BOOL.T : BOOL.F;
    }
  };
  const selection = {
    selectCallback: null,
    isEnabled: false,
    setSelectCallback: (callback) => (selection.selectCallback = callback),
    enable: () => {
      if (!isValidCallback(selection.selectCallback) || selection.isEnabled) return;
      mainShipElement.disabled = false;
      mainShipElement.addEventListener(MOUSE_EVENTS.CLICK, selection.selectCallback);
      selection.isEnabled = true;
    },
    disable: () => {
      if (!isValidCallback(selection.selectCallback) || !selection.isEnabled) return;
      mainShipElement.disabled = true;
      mainShipElement.removeEventListener(MOUSE_EVENTS.CLICK, selection.selectCallback);
      selection.isEnabled = false;
    },
    reset: () => {
      selection.disable();
      selection.selectCallback = null;
      selection.isEnabled = false;
    }
  };
  const placement = {
    placeCallback: null,
    toggleOrientationCallback: null,
    isEnabled: false,
    placementContainer: null,
    isValidCallback: () =>
      isValidCallback(placement.placeCallback) &&
      isValidCallback(placement.toggleOrientationCallback),
    setPlaceCallback: (callback) => (placement.placeCallback = callback),
    setToggleOrientationCallback: (callback) => (placement.toggleOrientationCallback = callback),
    setPlacementContainer: (container) => (placement.placementContainer = container),
    enable: () => {
      if (!placement.isValidCallback() || placement.isEnabled) return;
      if (!placement.placementContainer) throw new Error('No placement container set.');
      placement.placementContainer.addEventListener(
        KEY_EVENTS.DOWN,
        placement.toggleOrientationCallback
      );
      placement.placementContainer.addEventListener(
        MOUSE_EVENTS.DOWN,
        placement.toggleOrientationCallback
      );
      rotateButtonElement.addEventListener(MOUSE_EVENTS.CLICK, placement.toggleOrientationCallback);
      placement.placementContainer.addEventListener(MOUSE_EVENTS.CLICK, placement.placeCallback);
      placement.isEnabled = true;
    },
    disable: () => {
      if (!placement.isValidCallback() || !placement.isEnabled) return;
      if (!placement.placementContainer) throw new Error('No placement container set.');
      placement.placementContainer.removeEventListener(
        KEY_EVENTS.DOWN,
        placement.toggleOrientationCallback
      );
      placement.placementContainer.removeEventListener(
        MOUSE_EVENTS.DOWN,
        placement.toggleOrientationCallback
      );
      rotateButtonElement.removeEventListener(
        MOUSE_EVENTS.CLICK,
        placement.toggleOrientationCallback
      );
      placement.placementContainer.removeEventListener(MOUSE_EVENTS.CLICK, placement.placeCallback);
      placement.isEnabled = false;
    },
    reset: () => {
      placement.disable();
      placement.placeCallback = null;
      placement.toggleOrientationCallback = null;
      placement.isEnabled = false;
      placement.placementContainer = null;
    }
  };

  return {
    elements,
    update,
    selection,
    placement
  };
};
