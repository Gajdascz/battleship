import { buildPublisher } from './utility/buildPublisher';
import { MainGridModel } from './model/MainGridModel';
import { MainGridView } from './view/MainGridView';
import { StateCoordinator } from '../../../utility/stateManagement/StateCoordinator';
import { PLACEMENT_EVENTS } from '../../../utility/constants/events';
export const MainGridController = (scope, { numberOfRows, numberOfCols, letterAxis }) => {
  const model = MainGridModel(scope, { numberOfRows, numberOfCols, letterAxis });
  const view = MainGridView({ numberOfRows, numberOfCols, letterAxis });
  const publisher = buildPublisher(scope);
  const stateCoordinator = StateCoordinator(model.getScopedID(), model.getScope());

  const placementController = {
    initPreviewManager: () => {
      view.initializePreviewManager({
        maxVertical: model.getMaxVertical(),
        maxHorizontal: model.getMaxHorizontal(),
        letterAxis: model.getLetterAxis()
      });
    },
    handlePlacementRequest: ({ data }) => {
      const { id, length } = data;
      const placedCoordinates = view.placement.processPlacementRequest({
        length,
        id
      });
      if (!placedCoordinates) return;
      publisher.execute(publisher.keys.ACTIONS.PLACEMENT_PROCESSED, { placedCoordinates });
    },
    handleShipSelected: ({ data }) => {
      const { id, scopedID, length, orientation } = data;
      view.placement.updateSelectedShip({ id, scopedID, length, orientation });
    },
    handleOrientationToggle: ({ data }) => {
      const { orientation } = data;
      view.placement.updateOrientation(orientation);
    },
    requestPlacementFinalization: () =>
      publisher.request(publisher.keys.REQUESTS.PLACEMENT_FINALIZATION, {}),
    finalizePlacements: (placements) => {
      placements.forEach((placement) => {
        const result = model.place({
          start: placement.start,
          end: placement.end
        });
        if (!result) throw new Error(`Error finalizing placement: ${placement}`);
      });
      return true;
    }
  };

  const enablePlacementSettings = () => {
    view.placement.submit.setRequestPlacementSubmissionCallback(
      placementController.requestPlacementFinalization
    );
    placementController.initPreviewManager();
  };

  return {
    getModel: () => model,
    getView: () => view,
    getDimensions: () => model.getDimensions(),
    finalizePlacements: (placements) => placementController.finalizePlacements(placements),
    initializeStateManagement: () => {
      stateCoordinator.placement.addExecute(enablePlacementSettings);
      stateCoordinator.placement.addSubscribe(
        PLACEMENT_EVENTS.SHIP_SELECTED,
        placementController.handleShipSelected
      );
      stateCoordinator.placement.addSubscribe(
        PLACEMENT_EVENTS.SHIP_ORIENTATION_TOGGLED,
        placementController.handleOrientationToggle
      );
      stateCoordinator.placement.addSubscribe(
        PLACEMENT_EVENTS.SHIP_PLACEMENT_REQUESTED,
        placementController.handlePlacementRequest
      );
      stateCoordinator.initializeManager();
    }
  };
};
