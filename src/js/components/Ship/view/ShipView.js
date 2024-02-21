import { SHIP_CLASSES } from '../../../utility/constants/components/ship';
import { BOOL } from '../../../utility/constants/dom/attributes';
import { KEY_EVENTS, MOUSE_EVENTS } from '../../../utility/constants/events';
import { buildShipUIObj } from './buildShipUIObj';
import { ListenerManager } from '../../../utility/uiBuilderUtils/ListenerManager';

const EVENT_CONTROLLER_KEYS = {
  MAIN_SHIP_SELECT: 'mainShipSelect',
  MAIN_SHIP_PLACE: 'mainShipPlace',
  MOUSE_TOGGLE_ORIENTATION: 'mouseToggleOrientation',
  KEY_TOGGLE_ORIENTATION: 'keyToggleOrientation',
  BUTTON_TOGGLE_ORIENTATION: 'buttonToggleOrientation'
};

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

  const listenerManager = ListenerManager();

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

  const initializeSelection = (selectCallback) =>
    listenerManager.addController({
      element: mainShipElement,
      event: MOUSE_EVENTS.CLICK,
      callback: selectCallback,
      key: EVENT_CONTROLLER_KEYS.MAIN_SHIP_SELECT,
      enable: true
    });

  const initializePlacement = ({
    placementContainer,
    placeCallback,
    toggleOrientationCallback
  }) => {
    listenerManager.addController({
      element: placementContainer,
      event: MOUSE_EVENTS.CLICK,
      callback: placeCallback,
      key: EVENT_CONTROLLER_KEYS.MAIN_SHIP_PLACE,
      enable: true
    });
    listenerManager.addController({
      element: placementContainer,
      event: MOUSE_EVENTS.DOWN,
      callback: toggleOrientationCallback,
      key: EVENT_CONTROLLER_KEYS.MOUSE_TOGGLE_ORIENTATION,
      enable: true
    });
    listenerManager.addController({
      element: placementContainer,
      event: KEY_EVENTS.DOWN,
      callback: toggleOrientationCallback,
      key: EVENT_CONTROLLER_KEYS.KEY_TOGGLE_ORIENTATION,
      enable: true
    });
    listenerManager.addController({
      element: rotateButtonElement,
      event: MOUSE_EVENTS.CLICK,
      callback: toggleOrientationCallback,
      key: EVENT_CONTROLLER_KEYS.BUTTON_TOGGLE_ORIENTATION,
      enable: true
    });
  };

  const selection = {
    initialize: (selectCallback) => initializeSelection(selectCallback),
    enable: () => listenerManager.enableListener(EVENT_CONTROLLER_KEYS.MAIN_SHIP_SELECT),
    disable: () => listenerManager.disableListener(EVENT_CONTROLLER_KEYS.MAIN_SHIP_SELECT),
    remove: () => listenerManager.removeListener(EVENT_CONTROLLER_KEYS.MAIN_SHIP_SELECT)
  };

  const placement = {
    initialize: ({ placementContainer, placeCallback, toggleOrientationCallback }) =>
      initializePlacement({ placementContainer, placeCallback, toggleOrientationCallback }),
    enable: () => {
      listenerManager.enableListener(EVENT_CONTROLLER_KEYS.BUTTON_TOGGLE_ORIENTATION);
      listenerManager.enableListener(EVENT_CONTROLLER_KEYS.MOUSE_TOGGLE_ORIENTATION);
      listenerManager.enableListener(EVENT_CONTROLLER_KEYS.KEY_TOGGLE_ORIENTATION);
      listenerManager.enableListener(EVENT_CONTROLLER_KEYS.MAIN_SHIP_PLACE);
    },
    disable: () => {
      listenerManager.disableListener(EVENT_CONTROLLER_KEYS.BUTTON_TOGGLE_ORIENTATION);
      listenerManager.disableListener(EVENT_CONTROLLER_KEYS.MOUSE_TOGGLE_ORIENTATION);
      listenerManager.disableListener(EVENT_CONTROLLER_KEYS.KEY_TOGGLE_ORIENTATION);
      listenerManager.disableListener(EVENT_CONTROLLER_KEYS.MAIN_SHIP_PLACE);
    }
  };

  return {
    elements,
    update,
    selection,
    placement,
    clearListeners: () => listenerManager.reset()
  };
};
