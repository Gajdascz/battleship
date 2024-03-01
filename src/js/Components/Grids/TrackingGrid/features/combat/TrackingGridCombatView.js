// Tracking Grid Component
import { TRACKING_GRID } from '../../common/trackingGridConstants';
import { COMMON_GRID } from '../../../common/gridConstants';

// External
import { ListenerManager } from '../../../../../Utility/uiBuilderUtils/ListenerManager';
import { MOUSE_EVENTS } from '../../../../../Utility/constants/dom/domEvents';

const LISTENER_MANAGER_KEYS = {
  SEND_ATTACK: 'sendAttack'
};

export const TrackingGridCombatView = ({ view }) => {
  const gridElement = view.getGridElement();
  let isInitialized = false;
  let lastCell = null;
  const listenerManager = ListenerManager();
  const getTargetCoordinates = (e) => {
    const target = e.target.closest(
      `${TRACKING_GRID.PROPERTIES.CELL_ELEMENT}.${COMMON_GRID.CLASSES.CELL}`
    );
    if (target) return target.value;
  };

  const initialize = (onAttackCallback) => {
    if (isInitialized) return;
    const onAttack = (e) => {
      const coordinates = getTargetCoordinates(e);
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

  const enable = () => listenerManager.enableListener(LISTENER_MANAGER_KEYS.SEND_ATTACK);
  const disable = () => {
    view.disable();
    listenerManager.disableListener(LISTENER_MANAGER_KEYS.SEND_ATTACK);
  };
  const end = () => {
    if (!isInitialized) return;
    listenerManager.reset();
    isInitialized = false;
  };
  return {
    initialize,
    displayResult,
    enable,
    disable,
    end
  };
};
