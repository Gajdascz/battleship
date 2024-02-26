import { STATUSES } from '../../../../Utility/constants/common';
import { TRACKING_GRID } from '../utility/trackingGridConstants';
import { COMMON_GRID } from '../../common/gridConstants';
import { buildTrackingGridUIObj } from './buildTrackingGridUIObj';
import './tracking-grid-styles.css';

export const TrackingGridView = ({ numberOfRows, numberOfCols, letterAxis }) => {
  const { wrappedTrackingGridElement } = buildTrackingGridUIObj({
    numberOfRows,
    numberOfCols,
    letterAxis
  });
  const trackingGridElement = wrappedTrackingGridElement.querySelector(`.${TRACKING_GRID.TYPE}`);
  const cells = trackingGridElement.querySelectorAll(`.${COMMON_GRID.CLASSES.CELL}`);
  const enable = () => [...cells].forEach((cell) => (cell.disabled = true));
  const disable = () => [...cells].forEach((cell) => (cell.disabled = false));
  const attachToWrapper = (element) => wrappedTrackingGridElement.append(element);
  const hide = () => (wrappedTrackingGridElement.style.display = 'none');
  const show = () => wrappedTrackingGridElement.removeAttribute('style');
  const getCell = (coordinates) =>
    wrappedTrackingGridElement.querySelector(TRACKING_GRID.CELL_SELECTOR(coordinates));
  const setCellStatus = (cell, status) =>
    cell.setAttribute(TRACKING_GRID.PROPERTIES.ATTRIBUTES.CELL_STATUS_DATA, status);

  const displayHit = (coordinates) => {
    const cell = getCell(coordinates);
    setCellStatus(cell, STATUSES.HIT);
  };
  const displayMiss = (coordinates) => {
    const cell = getCell(coordinates);
    setCellStatus(cell, STATUSES.MISS);
  };

  return {
    attachTo: (container) => container.append(wrappedTrackingGridElement),
    attachToWrapper,
    getGridElement: () => trackingGridElement,
    hide,
    show,
    enable,
    disable,
    displayHit,
    displayMiss
  };
};
