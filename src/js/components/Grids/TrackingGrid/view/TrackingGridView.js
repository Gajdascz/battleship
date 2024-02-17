import { STATUSES } from '../../../../utility/constants/common';
import { TRACKING_GRID } from '../../../../utility/constants/components/grids';
import { buildTrackingGridUIObj } from './buildTrackingGridUIObj';

export const TrackingGridView = ({ numberOfRows, numberOfCols, letterAxis }) => {
  const { wrappedTrackingGridElement } = buildTrackingGridUIObj({
    numberOfRows,
    numberOfCols,
    letterAxis
  });
  const trackingGridElement = wrappedTrackingGridElement.querySelector(
    `.${TRACKING_GRID.CLASSES.TYPE}`
  );

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

  const renderGrid = (container) => container.append(wrappedTrackingGridElement);

  return {
    elements: {
      wrapper: wrappedTrackingGridElement,
      grid: trackingGridElement
    }
  };
};
