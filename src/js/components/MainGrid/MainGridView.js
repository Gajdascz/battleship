import { MAIN_GRID } from '../../utility/constants/components/grids';
import { PreviewManager } from './utility/PreviewManager';

export const MainGridView = (mainGridElement) => {
  // wrapped element
  const _element = mainGridElement;
  const _grid = mainGridElement.querySelector(`.${MAIN_GRID.TYPE}`);
  const _previewManager = PreviewManager();

  const isShipPlaced = (shipID) =>
    _grid.querySelector(MAIN_GRID.PLACED_SHIP_SELECTOR(shipID)) !== null;

  const isValidPlacement = () =>
    _grid.querySelector(MAIN_GRID.INVALID_PLACEMENT_SELECTOR) === null &&
    _grid.querySelector(MAIN_GRID.VALID_PLACEMENT_SELECTOR) !== null;

  const getCell = (coordinates) => _grid.querySelector(MAIN_GRID.CELL_SELECTOR(coordinates));
  const getShipPlacementCells = (shipID) =>
    _grid.querySelectorAll(MAIN_GRID.PLACED_SHIP_SELECTOR(shipID));

  const displayPlacedShip = (placementCells, shipID) => {
    placementCells.forEach((cell) => {
      cell.classList.replace(MAIN_GRID.CLASSES.VALID_PLACEMENT, MAIN_GRID.CLASSES.PLACED_SHIP);
      cell.setAttribute(MAIN_GRID.PROPERTIES.ATTRIBUTES.PLACED_SHIP_NAME, shipID);
      cell.textContent = shipID.charAt(0).toUpperCase();
    });
    _previewManager.disable();
  };

  const clearPlacedShip = (shipID) => {
    const shipCells = getShipPlacementCells(shipID);
    shipCells.forEach((cell) => {
      cell.classList.remove(MAIN_GRID.CLASSES.PLACED_SHIP);
      cell.removeAttribute(MAIN_GRID.PROPERTIES.ATTRIBUTES.PLACED_SHIP_NAME);
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
    const placementCells = [..._grid.querySelectorAll(MAIN_GRID.VALID_PLACEMENT_SELECTOR)];
    if (placementCells.length !== shipLength) return;
    displayPlacedShip(placementCells, shipID);
    const placedCoordinates = placementCells.map((cell) => cell.dataset.coordinates);
    return placedCoordinates;
  };

  const displayShipHit = (coordinates) =>
    getCell(coordinates[0], coordinates[1]).classList.add(MAIN_GRID.CLASSES.HIT_MARKER);

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
