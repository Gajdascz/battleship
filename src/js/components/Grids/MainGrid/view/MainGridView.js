import { MAIN_GRID } from '../utility/mainGridConstants';
import { MOUSE_EVENTS } from '../../../../utility/constants/events';
import { PreviewManager } from '../utility/PreviewManager';
import { buildMainGridUIObj } from './buildMainGridUIObj';
import './main-grid-styles.css';
import { ListenerManager } from '../../../../utility/uiBuilderUtils/ListenerManager';
export const MainGridView = ({ numberOfRows, numberOfCols, letterAxis }) => {
  const { wrappedMainGridElement, submitPlacementsButtonElement } = buildMainGridUIObj({
    numberOfRows,
    numberOfCols,
    letterAxis
  });
  const mainGridElement = wrappedMainGridElement.querySelector(`.${MAIN_GRID.TYPE}`);
  const previewManager = PreviewManager();

  const LISTENER_MANAGER_KEYS = {
    SUBMIT_PLACEMENTS: 'submitPlacements'
  };
  const listenerManager = ListenerManager();

  const placement = {
    isShipPlaced: (shipID) =>
      mainGridElement.querySelector(MAIN_GRID.PLACED_SHIP_SELECTOR(shipID)) !== null,
    isValidPlacement: () =>
      mainGridElement.querySelector(MAIN_GRID.INVALID_PLACEMENT_SELECTOR) === null &&
      mainGridElement.querySelector(MAIN_GRID.VALID_PLACEMENT_SELECTOR) !== null,
    getShipPlacementCells: (shipID) =>
      mainGridElement.querySelectorAll(MAIN_GRID.PLACED_SHIP_SELECTOR(shipID)),
    displayPlacedShip: (placementCells, id) => {
      placementCells.forEach((cell) => {
        cell.classList.replace(MAIN_GRID.CLASSES.VALID_PLACEMENT, MAIN_GRID.CLASSES.PLACED_SHIP);
        cell.setAttribute(MAIN_GRID.PROPERTIES.ATTRIBUTES.PLACED_SHIP_NAME, id);
        cell.textContent = id.charAt(0).toUpperCase();
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
    updateSelectedShip: ({ id, scopedID, length, orientation }) => {
      if (placement.isShipPlaced(id)) placement.clearPlacedShip(id);
      previewManager.setCurrentShip({ length, orientation });
      previewManager.enable();
    },
    updateOrientation: (orientation) => previewManager.updateOrientation(orientation),
    processPlacementRequest: ({ id, length }) => {
      if (!placement.isValidPlacement()) return;
      const placementCells = [
        ...mainGridElement.querySelectorAll(MAIN_GRID.VALID_PLACEMENT_SELECTOR)
      ];
      if (placementCells.length !== length) return;
      placement.displayPlacedShip(placementCells, id);
      const placedCoordinates = placementCells.map((cell) => cell.dataset.coordinates);
      return placedCoordinates;
    },

    submit: {
      initializeSubmitPlacementsButton: (callback) => {
        listenerManager.addController({
          key: LISTENER_MANAGER_KEYS.SUBMIT_PLACEMENTS,
          element: submitPlacementsButtonElement,
          event: MOUSE_EVENTS.CLICK,
          callback,
          enable: false
        });
      }
    }
  };

  const getCell = (coordinates) =>
    mainGridElement.querySelector(MAIN_GRID.CELL_SELECTOR(coordinates));

  const displayShipHit = (coordinates) =>
    getCell(coordinates[0], coordinates[1]).classList.add(MAIN_GRID.CLASSES.HIT_MARKER);

  return {
    attachTo: (container) => container.append(wrappedMainGridElement),
    attachToWrapper: (element) => wrappedMainGridElement.append(element),
    submitPlacementsButton: {
      getElement: () => submitPlacementsButtonElement,
      enable: () => listenerManager.enableListener(LISTENER_MANAGER_KEYS.SUBMIT_PLACEMENTS),
      disable: () => listenerManager.disableListener(LISTENER_MANAGER_KEYS.SUBMIT_PLACEMENTS),
      delete: () => {
        listenerManager.removeListener(LISTENER_MANAGER_KEYS.SUBMIT_PLACEMENTS);
        submitPlacementsButtonElement.remove();
      }
    },
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
