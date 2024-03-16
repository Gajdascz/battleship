import { STATUSES } from '../../../../../Utility/constants/common';
import { TRACKING_GRID } from '../../common/trackingGridConstants';
import { COMMON_GRID } from '../../../common/gridConstants';
import { buildTrackingGridUIObj } from './buildTrackingGridUIObj';
import './tracking-grid-styles.css';

export const TrackingGridView = ({ numberOfRows, numberOfCols, letterAxis }) => {
  const elements = {};
  const buildAndSetElements = () => {
    const { wrappedTrackingGridElement } = buildTrackingGridUIObj({
      numberOfRows,
      numberOfCols,
      letterAxis
    });
    const grid = wrappedTrackingGridElement.querySelector(`.${TRACKING_GRID.CLASSES.TYPE}`);
    const cells = grid.querySelectorAll(`.${COMMON_GRID.CLASSES.CELL}`);
    Object.assign(elements, { wrappedTrackingGridElement, grid, cells });
  };

  const isCellUnexplored = (cell) =>
    cell.dataset[TRACKING_GRID.PROPERTIES.ATTRIBUTES.CELL_STATUS_ACCESSOR] === STATUSES.UNEXPLORED;
  const enable = () =>
    [...elements.cells].forEach((cell) => {
      if (isCellUnexplored(cell)) cell.disabled = false;
    });
  const disable = () => [...elements.cells].forEach((cell) => (cell.disabled = true));
  const attachWithinWrapper = (element) => elements.wrappedTrackingGridElement.append(element);
  const hide = () => (elements.wrappedTrackingGridElement.style.display = 'none');
  const show = () => elements.wrappedTrackingGridElement.removeAttribute('style');
  const getCell = (coordinates) =>
    elements.grid.querySelector(TRACKING_GRID.SELECTORS.CELL(coordinates));
  const setCellStatus = (cell, status) =>
    cell.setAttribute(TRACKING_GRID.PROPERTIES.ATTRIBUTES.CELL_STATUS_DATA, status);
  buildAndSetElements();
  return {
    attachTo: (container) => container.append(elements.wrappedTrackingGridElement),
    attachWithinWrapper,
    getCell,
    setCellStatus,
    hide,
    show,
    enable,
    disable,
    elements: {
      getWrapper: () => elements.wrappedTrackingGridElement,
      getGrid: () => elements.grid
    },
    reset: () => {
      buildAndSetElements();
    }
  };
};
