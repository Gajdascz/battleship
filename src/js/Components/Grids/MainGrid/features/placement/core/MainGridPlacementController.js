import { MainGridPlacementView } from './MainGridPlacementView';
import { convertToInternalFormat } from '../../../../../../Utility/utils/coordinatesUtils';
export const MainGridPlacementController = ({ model, view }) => {
  let isInitialized = false;
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
  const initialize = (onEnd) => {
    if (isInitialized) return;
    placementView.initialize(onEnd);
    end();
    isInitialized = true;
  };
  const requestPlacement = (id, length) => {
    const placedCoordinates = placementView
      .processPlacementRequest({ length, id })
      ?.map(convertToInternalFormat);
    if (!placedCoordinates) return false;
    model.place(placedCoordinates, id);
    return placedCoordinates;
  };

  const updateSelectedEntity = (id, length, orientation) => {
    if (model.isEntityPlaced(id)) model.removePlacedEntity(id);
    placementView.update.preview.selectedEntity({ id, length, orientation });
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
    updateSelectedEntity,
    requestPlacement
  };
};
// const subscriptions = [
//   {
//     event: MAIN_GRID_EVENTS.PLACEMENT.ENABLE_PLACEMENT_SUBMISSION_REQUEST,
//     callback: onEnableSubmissionRequest
//   },
//   {
//     event: MAIN_GRID_EVENTS.PLACEMENT.DISABLE_PLACEMENT_SUBMISSION_REQUEST,
//     callback: onDisableSubmissionRequest
//   },
//   { event: MAIN_GRID_EVENTS.PLACEMENT.ENTITY_SELECTED, callback: onEntitySelection },
//   {
//     event: MAIN_GRID_EVENTS.PLACEMENT.ENTITY_ORIENTATION_UPDATED,
//     callback: onOrientationUpdated
//   },
//   {
//     event: MAIN_GRID_EVENTS.PLACEMENT.ENTITY_PLACEMENT_REQUESTED,
//     callback: onPlacementRequest
//   },
//   {
//     event: MAIN_GRID_EVENTS.PLACEMENT.END_REQUESTED,
//     callback: end
//   }
// ];

// emitter.subscribe(MAIN_GRID_EVENTS.PLACEMENT.INITIALIZE_REQUESTED, initialize);
// emitter.unsubscribeMany(subscriptions);
