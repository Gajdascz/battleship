import { buildPublisher } from './utility/buildPublisher';
import { MainGridModel } from './model/MainGridModel';
import { MainGridView } from './view/MainGridView';
import { StateCoordinator } from '../../../utility/stateManagement/StateCoordinator';
import { SHIP_EVENTS } from '../../Ship/events/shipEvents';
import { MainGridPlacementController } from './Placement/MainGridPlacementController';
import { MAIN_GRID_EVENTS } from './utility/mainGridEvents';

export const MainGridController = (scope, { numberOfRows, numberOfCols, letterAxis }) => {
  const model = MainGridModel(scope, { numberOfRows, numberOfCols, letterAxis });
  const view = MainGridView({ numberOfRows, numberOfCols, letterAxis });
  const publisher = buildPublisher(scope);
  const stateCoordinator = StateCoordinator(model.getScopedID(), model.getScope());
  const placementController = MainGridPlacementController({ model, view, publisher });

  return {
    getModel: () => model,
    getView: () => view,
    getDimensions: () => model.getDimensions(),
    finalizePlacements: (placements) => placementController.finalizePlacements(placements),
    initializeStateManagement: () => {
      stateCoordinator.placement.addExecute(placementController.enable);
      stateCoordinator.placement.addSubscribe(
        SHIP_EVENTS.SELECTION.SELECTED,
        placementController.handle.shipSelected
      );
      stateCoordinator.placement.addSubscribe(
        SHIP_EVENTS.SELECTION.ORIENTATION_TOGGLED,
        placementController.handle.orientationToggle
      );
      stateCoordinator.placement.addSubscribe(
        SHIP_EVENTS.PLACEMENT.REQUESTED,
        placementController.handle.placementRequest
      );
      stateCoordinator.placement.addSubscribe(
        MAIN_GRID_EVENTS.PLACEMENT.FINALIZED,
        view.placement.end
      );
      stateCoordinator.initializeManager();
    }
  };
};
