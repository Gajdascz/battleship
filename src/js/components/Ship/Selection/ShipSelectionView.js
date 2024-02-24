import { MOUSE_EVENTS, KEY_EVENTS } from '../../../utility/constants/events';
import { ListenerManager } from '../../../utility/uiBuilderUtils/ListenerManager';
const LISTENER_MANAGER_KEYS = {
  MAIN_SHIP_SELECT: 'mainShipSelect',
  MOUSE_TOGGLE_ORIENTATION: 'mouseToggleOrientation',
  KEY_TOGGLE_ORIENTATION: 'keyToggleOrientation',
  BUTTON_TOGGLE_ORIENTATION: 'buttonToggleOrientation'
};
export const ShipSelectionView = ({ elements }) => {
  const { mainShipElement, rotateButtonElement } = elements;
  const listenerManager = ListenerManager();
  let isInitialized = false;

  const initializeSelection = ({ selectCallback, toggleOrientationCallback }) => {
    if (isInitialized) return;
    listenerManager.addController({
      element: mainShipElement,
      event: MOUSE_EVENTS.CLICK,
      callback: selectCallback,
      key: LISTENER_MANAGER_KEYS.MAIN_SHIP_SELECT,
      enable: true
    });
    listenerManager.addController({
      element: document,
      event: MOUSE_EVENTS.DOWN,
      callback: toggleOrientationCallback,
      key: LISTENER_MANAGER_KEYS.MOUSE_TOGGLE_ORIENTATION,
      enable: false
    });
    listenerManager.addController({
      element: document,
      event: KEY_EVENTS.DOWN,
      callback: toggleOrientationCallback,
      key: LISTENER_MANAGER_KEYS.KEY_TOGGLE_ORIENTATION,
      enable: false
    });
    listenerManager.addController({
      element: rotateButtonElement,
      event: MOUSE_EVENTS.CLICK,
      callback: toggleOrientationCallback,
      key: LISTENER_MANAGER_KEYS.BUTTON_TOGGLE_ORIENTATION,
      enable: false
    });
    isInitialized = true;
  };

  const enableSelect = () => listenerManager.enableListener(LISTENER_MANAGER_KEYS.MAIN_SHIP_SELECT);

  const disableSelect = () =>
    listenerManager.disableListener(LISTENER_MANAGER_KEYS.MAIN_SHIP_SELECT);

  const enableOrientationToggle = () => {
    listenerManager.enableListener(LISTENER_MANAGER_KEYS.BUTTON_TOGGLE_ORIENTATION);
    listenerManager.enableListener(LISTENER_MANAGER_KEYS.MOUSE_TOGGLE_ORIENTATION);
    listenerManager.enableListener(LISTENER_MANAGER_KEYS.KEY_TOGGLE_ORIENTATION);
  };
  const disableOrientationToggle = () => {
    listenerManager.disableListener(LISTENER_MANAGER_KEYS.BUTTON_TOGGLE_ORIENTATION);
    listenerManager.disableListener(LISTENER_MANAGER_KEYS.MOUSE_TOGGLE_ORIENTATION);
    listenerManager.disableListener(LISTENER_MANAGER_KEYS.KEY_TOGGLE_ORIENTATION);
  };

  const endSelection = () => {
    listenerManager.removeListener(LISTENER_MANAGER_KEYS.MAIN_SHIP_SELECT);
    listenerManager.removeListener(LISTENER_MANAGER_KEYS.BUTTON_TOGGLE_ORIENTATION);
    listenerManager.removeListener(LISTENER_MANAGER_KEYS.MOUSE_TOGGLE_ORIENTATION);
    listenerManager.removeListener(LISTENER_MANAGER_KEYS.KEY_TOGGLE_ORIENTATION);
    rotateButtonElement.remove();
    listenerManager.reset();
    isInitialized = false;
  };

  return {
    initialize: ({ selectCallback, toggleOrientationCallback }) =>
      initializeSelection({ selectCallback, toggleOrientationCallback }),
    select: {
      enable: () => enableSelect(),
      disable: () => disableSelect()
    },
    orientationToggle: {
      enable: () => enableOrientationToggle(),
      disable: () => disableOrientationToggle()
    },
    end: () => endSelection()
  };
};
