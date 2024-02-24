import { MOUSE_EVENTS } from '../../../utility/constants/events';
import { ListenerManager } from '../../../utility/uiBuilderUtils/ListenerManager';

const LISTENER_MANAGER_KEYS = {
  MAIN_SHIP_PLACE: 'mainShipPlace'
};

export const ShipPlacementView = () => {
  const listenerManager = ListenerManager();
  let isInitialized = false;
  const initializePlacement = ({ placementContainer, placeCallback }) => {
    if (isInitialized) return;
    listenerManager.addController({
      element: placementContainer,
      event: MOUSE_EVENTS.CLICK,
      callback: placeCallback,
      key: LISTENER_MANAGER_KEYS.MAIN_SHIP_PLACE,
      enable: true
    });
    isInitialized = true;
  };

  const enableListeners = () =>
    listenerManager.enableListener(LISTENER_MANAGER_KEYS.MAIN_SHIP_PLACE);
  const disableListeners = () =>
    listenerManager.disableListener(LISTENER_MANAGER_KEYS.MAIN_SHIP_PLACE);
  const endPlacement = () => {
    listenerManager.removeListener(LISTENER_MANAGER_KEYS.MAIN_SHIP_PLACE);
    listenerManager.reset();
    isInitialized = false;
  };

  return {
    initialize: ({ placementContainer, placeCallback }) => {
      initializePlacement({ placementContainer, placeCallback });
    },
    enable: () => enableListeners(),
    disable: () => disableListeners(),
    end: () => endPlacement()
  };
};
