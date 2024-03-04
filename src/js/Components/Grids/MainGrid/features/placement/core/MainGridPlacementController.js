import { MainGridPlacementView } from './MainGridPlacementView';
import { convertToInternalFormat } from '../../../../../../Utility/utils/coordinatesUtils';
export const MainGridPlacementController = ({ model, view }) => {
  let isInitialized = false;
  let selectedEntityID = null;
  const previewConfig = {
    gridElement: view.elements.getWrapper().element,
    getCell: view.getCell,
    maxVertical: model.getMaxVertical(),
    maxHorizontal: model.getMaxHorizontal(),
    letterAxis: model.getLetterAxis()
  };
  const placementView = MainGridPlacementView({
    mainGridElement: view.elements.getGrid().element,
    submitPlacementsButtonElement: view.elements.getSubmitPlacementsButton().element,
    previewConfig
  });
  const initialize = (submitPlacementsCallback, handleRequestCallback) => {
    if (isInitialized) return;
    const requestPlacementCallback = (e) => {
      const coordinates = requestPlacement(e);
      if (coordinates) handleRequestCallback(coordinates);
    };
    placementView.initialize(submitPlacementsCallback, requestPlacementCallback);
    isInitialized = true;
  };
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

  const updateSelectedEntity = (id, length, orientation) => {
    if (model.isEntityPlaced(id)) model.removePlacedEntity(id);
    placementView.update.preview.selectedEntity({ id, length, orientation });
    placementView.enable.placementRequest();
    selectedEntityID = id;
  };
  const updateOrientation = (orientation) => placementView.update.preview.orientation(orientation);

  const enableSubmission = () => placementView.enable.submitPlacements();

  const disableSubmission = () => placementView.disable.submitPlacements();

  const end = () => {
    if (!isInitialized) return;
    placementView.end();
    isInitialized = false;
  };

  return {
    initialize,
    end,
    enableSubmission,
    disableSubmission,
    updateOrientation,
    updateSelectedEntity
  };
};
// const subscriptions = [
//   {
//     event: MAIN_GRID_PLACEMENT_EVENTS.ENABLE_PLACEMENT_SUBMISSION_REQUEST,
//     callback: onEnableSubmissionRequest
//   },
//   {
//     event: MAIN_GRID_PLACEMENT_EVENTS.DISABLE_PLACEMENT_SUBMISSION_REQUEST,
//     callback: onDisableSubmissionRequest
//   },
//   { event: MAIN_GRID_PLACEMENT_EVENTS.ENTITY_SELECTED, callback: onEntitySelection },
//   {
//     event: MAIN_GRID_PLACEMENT_EVENTS.ENTITY_ORIENTATION_UPDATED,
//     callback: onOrientationUpdated
//   },
//   {
//     event: MAIN_GRID_PLACEMENT_EVENTS.ENTITY_PLACEMENT_REQUESTED,
//     callback: onPlacementRequest
//   },
//   {
//     event: MAIN_GRID_PLACEMENT_EVENTS.END_REQUESTED,
//     callback: end
//   }
// ];

// emitter.subscribe(MAIN_GRID_PLACEMENT_EVENTS.INITIALIZE_REQUESTED, initialize);
// emitter.unsubscribeMany(subscriptions);
