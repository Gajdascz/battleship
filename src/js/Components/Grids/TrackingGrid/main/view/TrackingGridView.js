import { STATUSES } from '../../../../../Utility/constants/common';
import { TRACKING_GRID } from '../../common/trackingGridConstants';
import { COMMON_GRID } from '../../../common/gridConstants';
import { buildTrackingGridUIObj } from './buildTrackingGridUIObj';

import './tracking-grid-styles.css';

const ELEMENT_IDS = {
  WRAPPER: 'trackingGridWrapper',
  GRID: 'trackingGrid'
};

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
  const attachWithinWrapper = (element) => wrappedTrackingGridElement.append(element);
  const hide = () => (wrappedTrackingGridElement.style.display = 'none');
  const show = () => wrappedTrackingGridElement.removeAttribute('style');
  const getCell = (coordinates) =>
    trackingGridElement.querySelector(TRACKING_GRID.SELECTORS.CELL(coordinates));
  const setCellStatus = (cell, status) =>
    cell.setAttribute(TRACKING_GRID.PROPERTIES.ATTRIBUTES.CELL_STATUS_DATA, status);

  return {
    attachTo: (container) => container.append(wrappedTrackingGridElement),
    attachWithinWrapper,
    getCell,
    setCellStatus,
    hide,
    show,
    enable,
    disable,
    elements: {
      getWrapper: () => ({ id: ELEMENT_IDS.WRAPPER, element: wrappedTrackingGridElement }),
      getGrid: () => ({ id: ELEMENT_IDS.GRID, element: trackingGridElement })
    }
  };
};
