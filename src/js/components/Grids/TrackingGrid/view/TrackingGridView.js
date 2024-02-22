import { STATUSES } from '../../../../utility/constants/common';
import { TRACKING_GRID, COMMON_GRID } from '../../../../utility/constants/components/grids';
import { buildTrackingGridUIObj } from './buildTrackingGridUIObj';
import '../../common/grid-style.css';

export const TrackingGridView = ({ numberOfRows, numberOfCols, letterAxis }) => {
  const { wrappedTrackingGridElement } = buildTrackingGridUIObj({
    numberOfRows,
    numberOfCols,
    letterAxis
  });
  const trackingGridElement = wrappedTrackingGridElement.querySelector(`.${TRACKING_GRID.TYPE}`);
  const cells = trackingGridElement.querySelectorAll(`.${COMMON_GRID.CLASSES.CELL}`);
  const enableCells = () => [...cells].forEach((cell) => (cell.disabled = true));
  const disableCells = () => [...cells].forEach((cell) => (cell.disabled = false));

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
    elements: {
      wrapper: wrappedTrackingGridElement,
      grid: trackingGridElement
    },
    enableCells,
    disableCells
  };
};
