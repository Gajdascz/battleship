// Tracking Grid Component
import { TRACKING_GRID } from '../../common/trackingGridConstants';
import { COMMON_GRID } from '../../../common/gridConstants';

// External
import { ListenerManager } from '../../../../../Utility/uiBuilderUtils/ListenerManager';
import { MOUSE_EVENTS } from '../../../../../Utility/constants/dom/domEvents';

const LISTENER_MANAGER_KEYS = {
  SEND_ATTACK: 'sendAttack'
};

export const TrackingGridCombatView = (view) => {
  const gridElement = view.getGridElement();
  let isInitialized = false;
  let lastCell = null;
  const listenerManager = ListenerManager();
  const getTargetCoordinates = (e) =>
    e.target.closest(`${TRACKING_GRID.PROPERTIES.CELL_ELEMENT}.${COMMON_GRID.CLASSES.CELL}`)?.value;

  const initialize = (onAttackCallback) => {
    if (isInitialized) return;
    const onAttack = (e) => {
      const coordinates = getTargetCoordinates(e);
      if (!coordinates) return;
      lastCell = view.getCell(coordinates);
      onAttackCallback(coordinates);
    };
    listenerManager.addController({
      element: gridElement,
      key: LISTENER_MANAGER_KEYS.SEND_ATTACK,
      event: MOUSE_EVENTS.CLICK,
      callback: onAttack,
      enable: false
    });
    isInitialized = true;
  };
  const displayResult = (result) => {
    view.setCellStatus(lastCell, result);
    lastCell = null;
  };

  const end = () => {
    if (!isInitialized) return;
    listenerManager.reset();
    isInitialized = false;
  };
  return {
    initialize,
    displayResult,
    end
  };
};
