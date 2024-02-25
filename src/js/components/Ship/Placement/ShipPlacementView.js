import { MOUSE_EVENTS } from '../../../utility/constants/events';
import { ListenerManager } from '../../../utility/uiBuilderUtils/ListenerManager';
import { BOOL } from '../../../utility/constants/dom/attributes';

const LISTENER_MANAGER_KEYS = {
  REQUEST_PLACEMENT: 'requestPlacement'
};

export const ShipPlacementView = (mainShipElement) => {
  const listenerManager = ListenerManager();
  let isInitialized = false;
  const initializePlacement = ({ placementContainer, requestPlacementCallback }) => {
    console.log(requestPlacementCallback);
    if (isInitialized) return;
    listenerManager.addController({
      element: placementContainer,
      event: MOUSE_EVENTS.CLICK,
      callback: requestPlacementCallback,
      key: LISTENER_MANAGER_KEYS.REQUEST_PLACEMENT,
      enable: false
    });
    isInitialized = true;
  };

  const enableListeners = () =>
    listenerManager.enableListener(LISTENER_MANAGER_KEYS.REQUEST_PLACEMENT);
  const disableListeners = () =>
    listenerManager.disableListener(LISTENER_MANAGER_KEYS.REQUEST_PLACEMENT);
  const endPlacement = () => {
    listenerManager.removeListener(LISTENER_MANAGER_KEYS.REQUEST_PLACEMENT);
    listenerManager.reset();
    isInitialized = false;
  };

  return {
    initialize: ({ placementContainer, requestPlacementCallback }) => {
      initializePlacement({ placementContainer, requestPlacementCallback });
    },
    update: {
      placementStatus: (isPlaced) => (mainShipElement.dataset.placed = isPlaced ? BOOL.T : BOOL.F)
    },
    enableRequest: () => enableListeners(),
    disableRequest: () => disableListeners(),
    end: () => endPlacement()
  };
};
