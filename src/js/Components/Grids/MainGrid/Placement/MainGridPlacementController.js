import { PUBLISHER_KEYS } from '../utility/buildPublisher';
import { MainGridPlacementView } from './MainGridPlacementView';

export const MainGridPlacementController = ({ model, view, publisher }) => {
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
  const handlePlacementRequest = ({ data }) => {
    const { id, length } = data;
    const placedCoordinates = placementView.processRequest({
      length,
      id
    });
    if (!placedCoordinates) return;
    publisher.execute(PUBLISHER_KEYS.ACTIONS.PLACEMENT_PROCESSED, { placedCoordinates });
  };
  const handleShipSelected = ({ data }) => {
    const { id, length, orientation } = data;
    placementView.preview.updateSelectedShip({ id, length, orientation });
  };
  const handleOrientationToggle = ({ data }) => {
    const { orientation } = data;
    placementView.preview.updateOrientation(orientation);
  };
  const requestPlacementFinalization = () =>
    publisher.request(PUBLISHER_KEYS.REQUESTS.PLACEMENT_FINALIZATION, {});

  const finalizePlacements = (placements) => {
    placements.forEach((placement) => {
      const result = model.place({
        start: placement.start,
        end: placement.end
      });
      if (!result) throw new Error(`Error finalizing placement: ${placement}`);
    });
    return true;
  };
  const enablePlacementSettings = () => {
    placementView.initialize(requestPlacementFinalization);
    publisher.execute(
      PUBLISHER_KEYS.ACTIONS.PLACEMENT_CONTAINER_CREATED,
      {
        container: view.elements.getGrid()
      },
      true
    );
  };

  return {
    enable: () => enablePlacementSettings(),
    initialize: (submitPlacementsCallback) => {
      placementView.initialize(submitPlacementsCallback);
    },
    handle: {
      placementRequest: ({ data }) => handlePlacementRequest({ data }),
      shipSelected: ({ data }) => handleShipSelected({ data }),
      orientationToggle: ({ data }) => handleOrientationToggle({ data })
    },
    preview: {
      updateSelectedShip: ({ id, length, orientation }) =>
        placementView.preview.updateSelectedShip({ id, length, orientation }),
      updateOrientation: (orientation) => placementView.preview.updateOrientation(orientation)
    },
    finalizePlacements,
    end: () => placementView.end(),
    submitButton: placementView.placement.submitButton
  };
};
