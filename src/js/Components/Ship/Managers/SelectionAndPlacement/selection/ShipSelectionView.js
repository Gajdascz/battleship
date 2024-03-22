import { MOUSE_EVENTS, KEY_EVENTS } from '../../../../../Utility/constants/dom/domEvents';
import { ListenerManager } from '../../../../../Utility/uiBuilderUtils/ListenerManager';
import { SHIP_CLASSES } from '../../../common/shipConstants';

const LISTENER_MANAGER_KEYS = {
  MAIN_SHIP_SELECT: 'mainShipSelect',
  MOUSE_TOGGLE_ORIENTATION: 'mouseToggleOrientation',
  KEY_TOGGLE_ORIENTATION: 'keyToggleOrientation',
  BUTTON_TOGGLE_ORIENTATION: 'buttonToggleOrientation'
};

/**
 * Manages the selection user interface and DOM-level events.
 *
 * @param {Object} detail Initialization detail.
 * @param {HTMLElement} mainShipElement Ship DOM Element.
 * @param {HTMLElement} rotateButtonElement Rotate ship button DOM Element.
 * @returns {Object} Interface for managing the ship's selection view.
 */
export const ShipSelectionView = ({ mainShipElement, rotateButtonElement }) => {
  const listenerManager = ListenerManager();
  const { addController, enableListener, disableListener, removeListener } = listenerManager;
  let isInitialized = false;

  /**
   * Assigns callbacks to user interface DOM-level interactions and event listeners.
   *
   * @param {Object} detail Contains callbacks for UI.
   * @param {Object} detail.requestSelectionCallback Function to execute when user selects ship in interface.
   * @param {Object} detail.toggleOrientationCallback Function to execute when user toggles ship orientation in interface.
   */
  const initializeSelection = ({ requestSelectionCallback, toggleOrientationCallback }) => {
    if (isInitialized) return;
    addController({
      element: mainShipElement,
      event: MOUSE_EVENTS.CLICK,
      callback: requestSelectionCallback,
      key: LISTENER_MANAGER_KEYS.MAIN_SHIP_SELECT,
      enable: true
    });
    addController({
      element: document,
      event: MOUSE_EVENTS.DOWN,
      callback: toggleOrientationCallback,
      key: LISTENER_MANAGER_KEYS.MOUSE_TOGGLE_ORIENTATION,
      enable: false
    });
    addController({
      element: document,
      event: KEY_EVENTS.DOWN,
      callback: toggleOrientationCallback,
      key: LISTENER_MANAGER_KEYS.KEY_TOGGLE_ORIENTATION,
      enable: false
    });
    addController({
      element: rotateButtonElement,
      event: MOUSE_EVENTS.CLICK,
      callback: toggleOrientationCallback,
      key: LISTENER_MANAGER_KEYS.BUTTON_TOGGLE_ORIENTATION,
      enable: true
    });
    isInitialized = true;
  };

  const enableSelect = () => enableListener(LISTENER_MANAGER_KEYS.MAIN_SHIP_SELECT);

  const disableSelect = () => disableListener(LISTENER_MANAGER_KEYS.MAIN_SHIP_SELECT);

  const enableOrientationToggle = () => {
    enableListener(LISTENER_MANAGER_KEYS.BUTTON_TOGGLE_ORIENTATION);
    enableListener(LISTENER_MANAGER_KEYS.MOUSE_TOGGLE_ORIENTATION);
    enableListener(LISTENER_MANAGER_KEYS.KEY_TOGGLE_ORIENTATION);
  };
  const disableOrientationToggle = () => {
    disableListener(LISTENER_MANAGER_KEYS.BUTTON_TOGGLE_ORIENTATION);
    disableListener(LISTENER_MANAGER_KEYS.MOUSE_TOGGLE_ORIENTATION);
    disableListener(LISTENER_MANAGER_KEYS.KEY_TOGGLE_ORIENTATION);
  };

  const reset = () => {
    removeListener(LISTENER_MANAGER_KEYS.MAIN_SHIP_SELECT);
    removeListener(LISTENER_MANAGER_KEYS.BUTTON_TOGGLE_ORIENTATION);
    removeListener(LISTENER_MANAGER_KEYS.MOUSE_TOGGLE_ORIENTATION);
    removeListener(LISTENER_MANAGER_KEYS.KEY_TOGGLE_ORIENTATION);
    rotateButtonElement.remove();
    listenerManager.reset();
    isInitialized = false;
  };

  return {
    initialize: ({ requestSelectionCallback, toggleOrientationCallback }) =>
      initializeSelection({ requestSelectionCallback, toggleOrientationCallback }),
    enable: {
      select: () => enableSelect(),
      orientationToggle: () => enableOrientationToggle(),
      all: () => {
        enableSelect();
        enableOrientationToggle();
      }
    },
    disable: {
      select: () => disableSelect(),
      orientationToggle: () => disableOrientationToggle(),
      all: () => {
        disableSelect();
        disableOrientationToggle();
      }
    },
    update: {
      orientation: (newOrientation) => (mainShipElement.dataset.orientation = newOrientation),
      selectedStatus: (isSelected) =>
        mainShipElement.classList.toggle(SHIP_CLASSES.SELECTED, isSelected)
    },
    reset
  };
};
