import { MAIN_GRID } from '../../../../utility/constants/components/grids';
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

  const placement = {
    isShipPlaced: (shipID) =>
      mainGridElement.querySelector(MAIN_GRID.PLACED_SHIP_SELECTOR(shipID)) !== null,
    isValidPlacement: () =>
      mainGridElement.querySelector(MAIN_GRID.INVALID_PLACEMENT_SELECTOR) === null &&
      mainGridElement.querySelector(MAIN_GRID.VALID_PLACEMENT_SELECTOR) !== null,
    getShipPlacementCells: (shipID) =>
      mainGridElement.querySelectorAll(MAIN_GRID.PLACED_SHIP_SELECTOR(shipID)),
    displayPlacedShip: (placementCells, shipID) => {
      placementCells.forEach((cell) => {
        cell.classList.replace(MAIN_GRID.CLASSES.VALID_PLACEMENT, MAIN_GRID.CLASSES.PLACED_SHIP);
        cell.setAttribute(MAIN_GRID.PROPERTIES.ATTRIBUTES.PLACED_SHIP_NAME, shipID);
        cell.textContent = shipID.charAt(0).toUpperCase();
      });
      previewManager.disable();
    },
    clearPlacedShip: (shipID) => {
      const shipCells = placement.getShipPlacementCells(shipID);
      shipCells.forEach((cell) => {
        cell.classList.remove(MAIN_GRID.CLASSES.PLACED_SHIP);
        cell.removeAttribute(MAIN_GRID.PROPERTIES.ATTRIBUTES.PLACED_SHIP_NAME);
        cell.textContent = '';
      });
    },
    handleShipSelected: ({ data }) => {
      const { id, length, orientation } = data;
      if (placement.isShipPlaced(id)) placement.clearPlacedShip(id);
      previewManager.setCurrentShip({ length, orientation });
      previewManager.enable();
    },
    handleOrientationToggle: ({ data }) => {
      const { orientation } = data;
      previewManager.updateOrientation(orientation);
    },

    handlePlacementRequest: ({ name, length }) => {
      if (!placement.isValidPlacement()) return;
      const placementCells = [
        ...mainGridElement.querySelectorAll(MAIN_GRID.VALID_PLACEMENT_SELECTOR)
      ];
      if (placementCells.length !== length) return;
      placement.displayPlacedShip(placementCells, name);
      const placedCoordinates = placementCells.map((cell) => cell.dataset.coordinates);
      return placedCoordinates;
    }
  };

  const getCell = (coordinates) =>
    mainGridElement.querySelector(MAIN_GRID.CELL_SELECTOR(coordinates));

  const displayShipHit = (coordinates) =>
    getCell(coordinates[0], coordinates[1]).classList.add(MAIN_GRID.CLASSES.HIT_MARKER);

  return {
    placement,
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
    elements: {
      wrapper: wrappedMainGridElement,
      grid: mainGridElement,
      submitBtn: submitPlacementsButtonElement
    }
  };
};
