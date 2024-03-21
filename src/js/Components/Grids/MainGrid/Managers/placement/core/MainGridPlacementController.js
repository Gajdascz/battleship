import { MainGridPlacementView } from './MainGridPlacementView';
import { convertToInternalFormat } from '../../../../../../Utility/utils/coordinatesUtils';

/**
 * Manages the main grid's placement logic, state, and interaction with the user interface.
 *
 * @param {Object} detail Contains initialization data including the data model and view.
 * @returns {Object} Provides methods to control the grid placement process.
 */
export const MainGridPlacementController = ({ model, view }) => {
  let isInitialized = false;
  let selectedEntityID = null;
  const previewConfig = {
    gridElement: view.elements.getWrapper(),
    getCell: view.getCell,
    maxVertical: model.getMaxVertical(),
    maxHorizontal: model.getMaxHorizontal(),
    letterAxis: model.getLetterAxis()
  };
  const placementView = MainGridPlacementView({
    mainGridElement: view.elements.getGrid(),
    submitPlacementsButtonElement: view.elements.getSubmitPlacementsButton(),
    previewConfig
  });

  /**
   * Initializes the controller, setting up callbacks for UI interactions related to placement submission and requests.
   *
   * @param {function} submitPlacementsCallback Invoked when placements are submitted.
   * @param {function} handleRequestCallback Invoked with coordinates upon a placement request.
   */
  const initialize = (submitPlacementsCallback, handleRequestCallback) => {
    if (isInitialized) return;
    const requestPlacementCallback = (e) => {
      const coordinates = requestPlacement(e);
      if (coordinates) handleRequestCallback(coordinates);
    };
    placementView.initialize(submitPlacementsCallback, requestPlacementCallback);
    isInitialized = true;
  };

  /**
   * Processes placement requests from the UI, updating the model and view accordingly.
   * Throws an error if no entity is selected for placement.
   *
   * @param {Event} e The DOM event triggered by the placement request.
   * @returns {array[number[]]} The coordinates where the entity is placed, if successful.
   */
  const requestPlacement = (e) => {
    if (e.button !== 0) return;
    if (!selectedEntityID) throw new Error(`Entity must be selected for placement.`);
    const placedCoordinates = placementView
      .processPlacementRequest(selectedEntityID)
      ?.map(convertToInternalFormat);
    if (!placedCoordinates) return false;
    model.place(placedCoordinates, selectedEntityID);
    placementView.disable.placementRequest();
    selectedEntityID = null;
    return placedCoordinates;
  };

  /**
   * Updates the view to reflect the selection of an entity, preparing for its placement.
   *
   * @param {string} id The unique identifier of the selected entity.
   * @param {number} length The length of the selected entity.
   * @param {string} orientation The orientation of the selected entity.
   */
  const updateSelectedEntity = (id, length, orientation) => {
    if (model.isEntityPlaced(id)) model.removePlacedEntity(id);
    placementView.update.preview.selectedEntity({ id, length, orientation });
    placementView.enable.placementRequest();
    selectedEntityID = id;
  };

  /**
   * Updates the orientation preview for the currently selected entity.
   *
   * @param {string} orientation The new orientation value.
   */
  const updateOrientation = (orientation) => placementView.update.preview.orientation(orientation);

  /**
   * Toggles the ability to submit placements based on the current state.
   *
   * @param {boolean} isReady Indicates whether submission should be enabled or disabled.
   */
  const toggleSubmission = (isReady) => {
    if (isReady) placementView.enable.submitPlacements();
    else placementView.disable.submitPlacements();
  };

  /**
   * Resets the controller to its initial state, preparing for a new placement process.
   */
  const reset = () => {
    if (!isInitialized) return;
    placementView.reset();
    isInitialized = false;
  };

  return {
    initialize,
    reset,
    toggleSubmission,
    updateOrientation,
    updateSelectedEntity
  };
};
