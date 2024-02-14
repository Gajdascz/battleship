import { MAIN_GRID } from '../../utility/constants/components/grids';
import { MOUSE_EVENTS } from '../../utility/constants/events';
import { PreviewManager } from './utility/PreviewManager';
export const MainGridView = (mainGridElement) => {
  // wrapped element
  const _element = mainGridElement;
  const _grid = mainGridElement.querySelector(`.${MAIN_GRID.TYPE}`);
  const _previewManager = PreviewManager();

  const isShipPlaced = (shipID) =>
    _grid.querySelector(`[data-placed-ship-name='${shipID}']`) !== null;

  const isValidPlacement = () =>
    _grid.querySelector('.invalid-placement') === null &&
    _grid.querySelector('.valid-placement') !== null;

  const getCell = (coordinates) => _grid.querySelector(`[data-coordinates="${coordinates}"]`);
  const getShipPlacementCells = (shipID) =>
    _grid.querySelectorAll(`[data-placed-ship-name=${shipID}]`);

  const displayPlacedShip = (placementCells, shipID) => {
    placementCells.forEach((cell) => {
      cell.classList.replace('valid-placement', 'placed-ship');
      cell.setAttribute('data-placed-ship-name', shipID);
      cell.textContent = shipID.charAt(0).toUpperCase();
    });
    _previewManager.disable();
  };

  const clearPlacedShip = (shipID) => {
    const shipCells = getShipPlacementCells(shipID);
    console.log(shipCells);
    shipCells.forEach((cell) => {
      cell.classList.remove('placed-ship');
      cell.removeAttribute('data-placed-ship-name');
      cell.textContent = '';
    });
  };

  const handleShipSelected = ({ length, id, orientation }) => {
    if (isShipPlaced(id)) clearPlacedShip(id);
    _previewManager.setCurrentShip({ length, orientation });
    _previewManager.enable();
  };
  const handleOrientationToggle = ({ orientation }) =>
    _previewManager.updateOrientation(orientation);

  const handlePlacementRequest = ({ shipLength, shipID }) => {
    if (!isValidPlacement()) return;
    const placementCells = [..._grid.querySelectorAll('.valid-placement')];
    if (placementCells.length !== shipLength) return;
    displayPlacedShip(placementCells, shipID);
    const placedCoordinates = placementCells.map((cell) => cell.dataset.coordinates);
    return placedCoordinates;
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
        element: _element,
        getCell,
        maxVertical,
        maxHorizontal,
        letterAxis
      });
    },
    handleShipSelected,
    handleOrientationToggle,
    handlePlacementRequest
  };
};
