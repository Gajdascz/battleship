import { MainGridPlacementView } from './MainGridPlacementView';
import { convertToInternalFormat } from '../../../../../../Utility/utils/coordinatesUtils';
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

  const toggleSubmission = (isReady) => {
    if (isReady) placementView.enable.submitPlacements();
    else placementView.disable.submitPlacements();
  };

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
