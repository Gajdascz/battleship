import { ListenerManager } from '../../../../Utility/uiBuilderUtils/ListenerManager';
import { PreviewManager } from './PreviewManager';
import { MAIN_GRID } from '../utility/mainGridConstants';
import { MOUSE_EVENTS } from '../../../../Utility/constants/dom/domEvents';

const LISTENER_MANAGER_KEYS = {
  SUBMIT_PLACEMENTS: 'submitPlacements'
};

export const MainGridPlacementView = ({
  mainGridElement,
  submitPlacementsButtonElement,
  previewConfig
}) => {
  let isInitialized = false;

  console.log(mainGridElement, submitPlacementsButtonElement, previewConfig);
  const listenerManager = ListenerManager();
  const previewManager = PreviewManager(previewConfig);

  const isShipPlaced = (shipID) =>
    mainGridElement.querySelector(MAIN_GRID.PLACED_SHIP_SELECTOR(shipID)) !== null;

  const isValidPlacement = () =>
    mainGridElement.querySelector(MAIN_GRID.INVALID_PLACEMENT_SELECTOR) === null &&
    mainGridElement.querySelector(MAIN_GRID.VALID_PLACEMENT_SELECTOR) !== null;

  const getShipPlacementCells = (shipID) =>
    mainGridElement.querySelectorAll(MAIN_GRID.PLACED_SHIP_SELECTOR(shipID));

  const displayPlacedShip = (placementCells, id) => {
    placementCells.forEach((cell) => {
      cell.classList.replace(MAIN_GRID.CLASSES.VALID_PLACEMENT, MAIN_GRID.CLASSES.PLACED_SHIP);
      cell.setAttribute(MAIN_GRID.PROPERTIES.ATTRIBUTES.PLACED_SHIP_NAME, id);
      cell.textContent = id.charAt(0).toUpperCase();
    });
    previewManager.disable();
  };

  const clearPlacedShip = (shipID) => {
    console.trace();
    const shipCells = getShipPlacementCells(shipID);
    shipCells.forEach((cell) => {
      cell.classList.remove(MAIN_GRID.CLASSES.PLACED_SHIP);
      cell.removeAttribute(MAIN_GRID.PROPERTIES.ATTRIBUTES.PLACED_SHIP_NAME);
      cell.textContent = '';
    });
  };

  const processPlacementRequest = ({ id, length }) => {
    console.log(`${id} processPlacementRequest`);
    if (!isValidPlacement()) return;
    const placementCells = [
      ...mainGridElement.querySelectorAll(MAIN_GRID.VALID_PLACEMENT_SELECTOR)
    ];
    if (placementCells.length !== length) return;
    displayPlacedShip(placementCells, id);
    const placedCoordinates = placementCells.map((cell) => cell.dataset.coordinates);
    return placedCoordinates;
  };
  const initialize = (submitPlacementsCallback) => {
    if (isInitialized) return;
    listenerManager.addController({
      key: LISTENER_MANAGER_KEYS.SUBMIT_PLACEMENTS,
      element: submitPlacementsButtonElement,
      event: MOUSE_EVENTS.CLICK,
      callback: submitPlacementsCallback,
      enable: false
    });
    previewManager.enable();
    isInitialized = true;
  };
  return {
    initialize,
    preview: {
      updateSelectedShip: ({ id, length, orientation }) => {
        if (isShipPlaced(id)) clearPlacedShip(id);
        previewManager.setCurrentShip({ length, orientation });
        previewManager.enable();
      },
      updateOrientation: (orientation) => previewManager.updateOrientation(orientation)
    },
    placement: {
      processRequest: ({ id, length }) => processPlacementRequest({ id, length }),
      submitButton: {
        getElement: () => submitPlacementsButtonElement,
        enable: () => listenerManager.enableListener(LISTENER_MANAGER_KEYS.SUBMIT_PLACEMENTS),
        disable: () => listenerManager.disableListener(LISTENER_MANAGER_KEYS.SUBMIT_PLACEMENTS),
        delete: () => {
          listenerManager.removeListener(LISTENER_MANAGER_KEYS.SUBMIT_PLACEMENTS);
          submitPlacementsButtonElement.remove();
        }
      }
    },
    end: () => {
      previewManager.reset();
      listenerManager.reset();
      submitPlacementsButtonElement.remove();
    }
  };
};
