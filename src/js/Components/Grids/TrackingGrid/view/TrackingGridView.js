import { STATUSES } from '../../../../Utility/constants/common';
import { TRACKING_GRID } from '../utility/trackingGridConstants';
import { COMMON_GRID } from '../../common/gridConstants';
import { buildTrackingGridUIObj } from './buildTrackingGridUIObj';
import { ListenerManager } from '../../../../Utility/uiBuilderUtils/ListenerManager';
import './tracking-grid-styles.css';
import { MOUSE_EVENTS } from '../../../../Utility/constants/dom/domEvents';

export const TrackingGridView = ({ numberOfRows, numberOfCols, letterAxis }) => {
  const { wrappedTrackingGridElement } = buildTrackingGridUIObj({
    numberOfRows,
    numberOfCols,
    letterAxis
  });
  const trackingGridElement = wrappedTrackingGridElement.querySelector(
    `.${TRACKING_GRID.CLASSES.TYPE}`
  );
  const cells = trackingGridElement.querySelectorAll(`.${COMMON_GRID.CLASSES.CELL}`);
  const isCellUnexplored = (cell) =>
    cell.dataset[TRACKING_GRID.PROPERTIES.ATTRIBUTES.CELL_STATUS_ACCESSOR] === STATUSES.UNEXPLORED;
  const enable = () =>
    [...cells].forEach((cell) => {
      if (isCellUnexplored(cell)) cell.disabled = false;
    });
  const disable = () => [...cells].forEach((cell) => (cell.disabled = true));
  const attachToWrapper = (element) => wrappedTrackingGridElement.append(element);
  const hide = () => (wrappedTrackingGridElement.style.display = 'none');
  const show = () => wrappedTrackingGridElement.removeAttribute('style');
  const getCell = (coordinates) =>
    trackingGridElement.querySelector(TRACKING_GRID.SELECTORS.CELL(coordinates));
  const setCellStatus = (cell, status) =>
    cell.setAttribute(TRACKING_GRID.PROPERTIES.ATTRIBUTES.CELL_STATUS_DATA, status);

  const listenerManager = ListenerManager();

  const getTargetCoordinates = (e) => {
    const target = e.target.closest(
      `${TRACKING_GRID.PROPERTIES.CELL_ELEMENT}.${COMMON_GRID.CLASSES.CELL}`
    );
    if (target) return target.value;
  };

  const combatManager = {
    isInitialized: false,
    lastCell: null,
    initialize: (onAttackCallback) => {
      if (combatManager.isInitialized) return;
      const onAttack = (e) => {
        const coordinates = getTargetCoordinates(e);
        combatManager.lastCell = getCell(coordinates);
        onAttackCallback(coordinates);
      };
      listenerManager.addController({
        element: trackingGridElement,
        key: 'sendAttack',
        event: MOUSE_EVENTS.CLICK,
        callback: onAttack,
        enable: false
      });
      combatManager.isInitialized = true;
    },
    displayResult: (result) => {
      setCellStatus(combatManager.lastCell, result);
      combatManager.lastCell = null;
    },
    enable: () => listenerManager.enableListener('sendAttack'),
    disable: () => listenerManager.disableListener('sendAttack'),
    end: () => {
      if (!combatManager.isInitialized) return;
      listenerManager.reset();
      combatManager.isInitialized = false;
    }
  };

  return {
    attachTo: (container) => container.append(wrappedTrackingGridElement),
    attachToWrapper,
    getGridElement: () => trackingGridElement,
    combatManager,
    hide,
    show,
    enable,
    disable
  };
};
