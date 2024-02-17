import { initializeStateCoordinator } from './utility/initializeStateCoordinator';
import { buildPublisher } from './utility/buildPublisher';
import { MainGridModel } from './model/MainGridModel';
import { MainGridView } from './view/MainGridView';
import { STATES } from '../../../utility/constants/common';
import { PUBLISHER_KEYS } from './utility/constants';

export const MainGridController = (scope, { numberOfRows, numberOfCols, letterAxis }) => {
  const model = MainGridModel(scope, { numberOfRows, numberOfCols, letterAxis });
  const view = MainGridView({ numberOfRows, numberOfCols, letterAxis });
  const publisher = buildPublisher(scope);
  const initPreviewManager = () => {
    view.initializePreviewManager({
      maxVertical: model.getMaxVertical(),
      maxHorizontal: model.getMaxHorizontal(),
      letterAxis: model.getLetterAxis()
    });
  };

  const processPlacementRequest = (request) => {
    const { id, length } = request;
    const placedCoordinates = view.placement.handlePlacementRequest({
      shipLength: length,
      shipID: id
    });
    if (!placedCoordinates) return;
    publisher.execute(PUBLISHER_KEYS.ACTIONS.PLACEMENT_PROCESSED, { placedCoordinates });
  };

  return {
    getModel: () => model,
    getView: () => view,
    initializeStateManagement: () =>
      initializeStateCoordinator(model.getID(), model.getScope(), {
        initPreviewManager,
        handleShipSelected: view.placement.handleShipSelected,
        handleOrientationToggle: view.placement.handleOrientationToggle,
        processPlacementRequest
      })
  };
};
