import { MAIN_GRID } from '../../../utility/constants/components/grids';
import { PreviewManager } from '../utility/PreviewManager';
import { buildMainGridUIObj } from './buildMainGridUIObj';

export const MainGridView = ({ numberOfRows, numberOfCols, letterAxis }) => {
  const { wrappedMainGridElement, submitPlacementsButtonElement } = buildMainGridUIObj({
    numberOfRows,
    numberOfCols,
    letterAxis
  });
  const mainGridElement = wrappedMainGridElement.querySelector(`.${MAIN_GRID.TYPE}`);
  const previewManager = PreviewManager();

  const isShipPlaced = (shipID) =>
    mainGridElement.querySelector(MAIN_GRID.PLACED_SHIP_SELECTOR(shipID)) !== null;

  const isValidPlacement = () =>
    mainGridElement.querySelector(MAIN_GRID.INVALID_PLACEMENT_SELECTOR) === null &&
    mainGridElement.querySelector(MAIN_GRID.VALID_PLACEMENT_SELECTOR) !== null;

  const getCell = (coordinates) =>
    mainGridElement.querySelector(MAIN_GRID.CELL_SELECTOR(coordinates));
  const getShipPlacementCells = (shipID) =>
    mainGridElement.querySelectorAll(MAIN_GRID.PLACED_SHIP_SELECTOR(shipID));

  const displayPlacedShip = (placementCells, shipID) => {
    placementCells.forEach((cell) => {
      cell.classList.replace(MAIN_GRID.CLASSES.VALID_PLACEMENT, MAIN_GRID.CLASSES.PLACED_SHIP);
      cell.setAttribute(MAIN_GRID.PROPERTIES.ATTRIBUTES.PLACED_SHIP_NAME, shipID);
      cell.textContent = shipID.charAt(0).toUpperCase();
    });
    previewManager.disable();
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
    previewManager.setCurrentShip({ length, orientation });
    previewManager.enable();
  };
  const handleOrientationToggle = ({ orientation }) =>
    previewManager.updateOrientation(orientation);

  const handlePlacementRequest = ({ shipLength, shipID }) => {
    if (!isValidPlacement()) return;
    const placementCells = [
      ...mainGridElement.querySelectorAll(MAIN_GRID.VALID_PLACEMENT_SELECTOR)
    ];
    if (placementCells.length !== shipLength) return;
    displayPlacedShip(placementCells, shipID);
    const placedCoordinates = placementCells.map((cell) => cell.dataset.coordinates);
    return placedCoordinates;
  };

  const displayShipHit = (coordinates) =>
    getCell(coordinates[0], coordinates[1]).classList.add(MAIN_GRID.CLASSES.HIT_MARKER);

  const renderGrid = (container) => container.append(wrappedMainGridElement);

  return {
    getSubmitPlacementsButton: () => submitPlacementsButtonElement,
    renderGrid,
    displayPlacedShip,
    clearPlacedShip,
    displayShipHit,
    initializePreviewManager: ({ maxVertical, maxHorizontal, letterAxis }) => {
      previewManager.attachToGrid({
        element: wrappedMainGridElement,
        getCell,
        maxVertical,
        maxHorizontal,
        letterAxis
      });
    },
    handleShipSelected,
    handleOrientationToggle,
    handlePlacementRequest,
    getElementBundle: () => ({
      wrapper: wrappedMainGridElement,
      grid: mainGridElement,
      submitBtn: submitPlacementsButtonElement
    })
  };
};
