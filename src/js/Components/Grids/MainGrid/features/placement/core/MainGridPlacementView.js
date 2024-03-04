// Main Grid Component
import { MAIN_GRID } from '../../../common/mainGridConstants';

// External
import { ListenerManager } from '../../../../../../Utility/uiBuilderUtils/ListenerManager';
import { PreviewManager } from './PreviewManager';
import { MOUSE_EVENTS } from '../../../../../../Utility/constants/dom/domEvents';

const LISTENER_MANAGER_KEYS = {
  SUBMIT_PLACEMENTS: 'submitPlacements',
  REQUEST_PLACEMENT: 'entityRequestPlacement'
};

export const MainGridPlacementView = ({
  mainGridElement,
  submitPlacementsButtonElement,
  previewConfig
}) => {
  let isInitialized = false;
  const listenerManager = ListenerManager();
  const previewManager = PreviewManager(previewConfig);

  const isEntityPlaced = (entityID) =>
    mainGridElement.querySelector(MAIN_GRID.PLACED_ENTITY_SELECTOR(entityID)) !== null;

  const isValidPlacement = () =>
    mainGridElement.querySelector(MAIN_GRID.INVALID_PLACEMENT_SELECTOR) === null &&
    mainGridElement.querySelector(MAIN_GRID.VALID_PLACEMENT_SELECTOR) !== null;

  const getEntityPlacementCells = (entityID) =>
    mainGridElement.querySelectorAll(MAIN_GRID.PLACED_ENTITY_SELECTOR(entityID));

  const displayPlacedEntity = (placementCells, id) => {
    placementCells.forEach((cell) => {
      cell.classList.replace(MAIN_GRID.CLASSES.VALID_PLACEMENT, MAIN_GRID.CLASSES.PLACED_ENTITY);
      cell.setAttribute(MAIN_GRID.PROPERTIES.ATTRIBUTES.PLACED_ENTITY_NAME, id);
      cell.textContent = id.charAt(0).toUpperCase();
    });
    previewManager.disable();
  };

  const clearPlacedEntity = (entityID) => {
    const EntityCells = getEntityPlacementCells(entityID);
    EntityCells.forEach((cell) => {
      cell.classList.remove(MAIN_GRID.CLASSES.PLACED_ENTITY);
      cell.removeAttribute(MAIN_GRID.PROPERTIES.ATTRIBUTES.PLACED_ENTITY_NAME);
      cell.textContent = '';
    });
  };

  const processPlacementRequest = (id) => {
    if (!isValidPlacement()) return;
    const placementCells = [
      ...mainGridElement.querySelectorAll(MAIN_GRID.VALID_PLACEMENT_SELECTOR)
    ];
    displayPlacedEntity(placementCells, id);
    const placedCoordinates = placementCells.map((cell) => cell.dataset.coordinates);
    return placedCoordinates;
  };

  const initialize = (submitPlacementsCallback, requestPlacementCallback) => {
    if (isInitialized) return;
    listenerManager.addController({
      key: LISTENER_MANAGER_KEYS.SUBMIT_PLACEMENTS,
      element: submitPlacementsButtonElement,
      event: MOUSE_EVENTS.CLICK,
      callback: submitPlacementsCallback,
      enable: false
    });
    listenerManager.addController({
      element: mainGridElement,
      event: MOUSE_EVENTS.CLICK,
      callback: requestPlacementCallback,
      key: LISTENER_MANAGER_KEYS.REQUEST_PLACEMENT,
      enable: false
    });
    previewManager.enable();
    isInitialized = true;
  };

  const enableSubmitPlacements = () =>
    listenerManager.enableListener(LISTENER_MANAGER_KEYS.SUBMIT_PLACEMENTS);
  const disableSubmitPlacements = () =>
    listenerManager.disableListener(LISTENER_MANAGER_KEYS.SUBMIT_PLACEMENTS);

  const enableRequestPlacements = () => {
    previewManager.enable();
    listenerManager.enableListener(LISTENER_MANAGER_KEYS.REQUEST_PLACEMENT);
  };
  const disableRequestPlacements = () => {
    previewManager.disable();
    listenerManager.disableListener(LISTENER_MANAGER_KEYS.REQUEST_PLACEMENT);
  };

  return {
    initialize,
    processPlacementRequest,
    enable: {
      placementRequest: () => enableRequestPlacements(),
      submitPlacements: () => enableSubmitPlacements(),
      all: () => {
        enableRequestPlacements();
        enableSubmitPlacements();
      }
    },
    disable: {
      placementRequest: () => disableRequestPlacements(),
      submitPlacements: () => disableSubmitPlacements(),
      all: () => {
        disableRequestPlacements();
        disableSubmitPlacements();
      }
    },
    update: {
      preview: {
        selectedEntity: ({ id, length, orientation }) => {
          if (isEntityPlaced(id)) clearPlacedEntity(id);
          previewManager.setCurrentEntity({ length, orientation });
          previewManager.enable();
        },
        orientation: (orientation) => previewManager.updateOrientation(orientation)
      },
      submitPlacementsButtonContainer: (container) => {
        submitPlacementsButtonElement.remove();
        container.append(submitPlacementsButtonElement);
      }
    },
    end: () => {
      previewManager.reset();
      listenerManager.reset();
      submitPlacementsButtonElement.remove();
      isInitialized = false;
    }
  };
};
