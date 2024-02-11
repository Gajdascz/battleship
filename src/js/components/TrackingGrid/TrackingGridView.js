import { STATUSES } from '../../utility/constants/common';
import { TRACKING_GRID } from '../../utility/constants/components/grids';

export const TrackingGridView = (trackingGridElement) => {
  const _element = trackingGridElement;

  const getCell = (coordinates) => _element.querySelector(TRACKING_GRID.CELL_SELECTOR(coordinates));
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
  const updateForPlacementState = () => {};
  const updateForProgressState = () => {};
  const updateForOverState = () => {};

  const renderGrid = (container) => container.append(_element);

  return { renderGrid };
};
