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
    submitPlacementsButtonElement: view.elements.getSubmitButton(),
    previewConfig
  });
  const handlePlacementRequest = ({ data }) => {
    const { id, length } = data;
    const placedCoordinates = view.placement.processRequest({
      length,
      id
    });
    if (!placedCoordinates) return;
    publisher.execute(PUBLISHER_KEYS.ACTIONS.PLACEMENT_PROCESSED, { placedCoordinates });
  };
  const handleShipSelected = ({ data }) => {
    const { id, length, orientation } = data;
    view.placement.preview.updateSelectedShip({ id, length, orientation });
  };
  const handleOrientationToggle = ({ data }) => {
    const { orientation } = data;
    view.placement.preview.updateOrientation(orientation);
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
    view.placement.initialize(requestPlacementFinalization);
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
    handle: {
      placementRequest: ({ data }) => handlePlacementRequest({ data }),
      shipSelected: ({ data }) => handleShipSelected({ data }),
      orientationToggle: ({ data }) => handleOrientationToggle({ data })
    },
    finalizePlacements
  };
};
