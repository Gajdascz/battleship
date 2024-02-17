import { buildPublisher } from './utility/buildPublisher';
import { MainGridModel } from './model/MainGridModel';
import { MainGridView } from './view/MainGridView';
import { PUBLISHER_KEYS } from './utility/constants';
import { StateCoordinator } from '../../../utility/stateManagement/StateCoordinator';
import { PLACEMENT_EVENTS } from '../../../utility/constants/events';
export const MainGridController = (scope, { numberOfRows, numberOfCols, letterAxis }) => {
  const model = MainGridModel(scope, { numberOfRows, numberOfCols, letterAxis });
  const view = MainGridView({ numberOfRows, numberOfCols, letterAxis });
  const publisher = buildPublisher(scope);
  const stateCoordinator = StateCoordinator(model.getScopedID(), model.getScope());
  const initPreviewManager = () => {
    view.initializePreviewManager({
      maxVertical: model.getMaxVertical(),
      maxHorizontal: model.getMaxHorizontal(),
      letterAxis: model.getLetterAxis()
    });
  };

  const processPlacementRequest = ({ data }) => {
    console.log(data);
    const { name, length } = data;
    const placedCoordinates = view.placement.handlePlacementRequest({
      length,
      name
    });
    if (!placedCoordinates) return;
    publisher.execute(PUBLISHER_KEYS.ACTIONS.PLACEMENT_PROCESSED, { placedCoordinates });
  };

  return {
    getModel: () => model,
    getView: () => view,
    initializeStateManagement: () => {
      stateCoordinator.placement.addExecute(initPreviewManager);
      stateCoordinator.placement.addSubscribe(
        PLACEMENT_EVENTS.SHIP_SELECTED,
        view.placement.handleShipSelected
      );
      stateCoordinator.placement.addSubscribe(
        PLACEMENT_EVENTS.SHIP_ORIENTATION_TOGGLED,
        view.placement.handleOrientationToggle
      );
      stateCoordinator.placement.addSubscribe(
        PLACEMENT_EVENTS.SHIP_PLACEMENT_REQUESTED,
        processPlacementRequest
      );
      stateCoordinator.initializeManager();
    }
  };
};
