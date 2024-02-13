import { COMMON_GRID } from '../../utility/constants/components/grids';
import { MOUSE_EVENTS } from '../../utility/constants/events';

export const MainGridView = (mainGridElement) => {
  const _element = mainGridElement;

  const getCell = (row, col) => _element.querySelector(`[data-coordinates="${row + col}"]`);
  const isAtopAnotherShip = (cell) => cell.classList.contains('placed-ship');
  const getShipPlacementCells = (shipID) =>
    _element.querySelectorAll(`[data-placed-ship-name=${shipID}]`);

  const displayPlacementPreview = (cells) => {
    clearPlacementPreview(_element);
    cells.forEach(({ row, col }) => {
      const cell = getCell(row, col);
      if (isAtopAnotherShip(cell)) cell.classList.add('invalid-placement');
      else cell.classList.add('valid-placement');
    });
  };

  const clearPlacementPreview = () => {
    _element.querySelectorAll('.valid-placement, .invalid-placement').forEach((cell) => {
      cell.classList.remove('valid-placement', 'invalid-placement');
    });
  };

  const displayPlacedShip = (placementCells, shipID) => {
    clearPlacementPreview();
    placementCells.forEach((cell) => {
      cell.classList.replace('valid-placement', 'placed-ship');
      cell.setAttribute('data-placed-ship-name', shipID);
      cell.textContent = shipID.charAt(0).toUpperCase();
    });
  };

  const clearPlacedShip = (shipID) => {
    const shipCells = getShipPlacementCells(shipID);
    shipCells.forEach((cell) => {
      cell.classList.remove('placed-ship');
      cell.removeAttribute('data-placed-ship-name');
      cell.textContent = '';
    });
  };

  const displayShipHit = (coordinates) =>
    getCell(coordinates[0], coordinates[1]).classList.add('main-grid-hit-marker');

  const enableInteractivity = () => {
    _element.addEventListener(MOUSE_EVENTS.OVER, (e) =>
      e.target.closest(COMMON_GRID.CELL_SELECTOR)
    );
  };

  const renderGrid = (container) => container.append(_element);

  return {
    renderGrid,
    displayPlacementPreview,
    clearPlacementPreview,
    displayPlacedShip,
    clearPlacedShip,
    displayShipHit,
    enableInteractivity
  };
};
