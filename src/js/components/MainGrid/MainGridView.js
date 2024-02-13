import { MAIN_GRID } from '../../utility/constants/components/grids';
import { PreviewManager } from './utility/PreviewManager';
export const MainGridView = (mainGridElement) => {
  // wrapped element
  const _element = mainGridElement;
  const _grid = mainGridElement.querySelector(`.${MAIN_GRID.TYPE}`);
  const _previewManager = PreviewManager();

  const getCell = (coordinates) => _grid.querySelector(`[data-coordinates="${coordinates}"]`);
  const getShipPlacementCells = (shipID) =>
    _grid.querySelectorAll(`[data-placed-ship-name=${shipID}]`);

  const displayPlacedShip = (placementCells, shipID) => {
    _previewManager.clearPreview();
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

  const renderGrid = (container) => container.append(_element);

  return {
    renderGrid,
    displayPlacedShip,
    clearPlacedShip,
    displayShipHit,
    initializePreviewManager: ({ maxVertical, maxHorizontal, letterAxis }) => {
      _previewManager.attachToGrid({
        element: _grid,
        getCell,
        maxVertical,
        maxHorizontal,
        letterAxis
      });
    },
    updateShipPreview: ({ length, orientation }) =>
      _previewManager.updateShipPreview({ length, orientation })
  };
};
