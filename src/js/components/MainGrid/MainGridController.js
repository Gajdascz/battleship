import { bundleComponentStates } from './utility/bundleComponentStates';
import { initializeSateManagement } from '../../utility/stateManagement/initializeStateManagement';
import { publish } from './utility/publishers';
import { MainGridModel } from './MainGridModel';
import { MainGridView } from './view/MainGridView';
export const MainGridController = ({ numberOfRows, numberOfCols, letterAxis }) => {
  const model = MainGridModel({ numberOfRows, numberOfCols, letterAxis });
  const view = MainGridView({ numberOfRows, numberOfCols, letterAxis });

  const initPreviewManager = () => {
    view.initializePreviewManager({
      maxVertical: model.getMaxVertical(),
      maxHorizontal: model.getMaxHorizontal(),
      letterAxis: model.getLetterAxis()
    });
  };

  const processPlacementRequest = (request) => {
    const { id, length } = request;
    const placedCoordinates = view.handlePlacementRequest({ shipLength: length, shipID: id });
    if (!placedCoordinates) return;
    publish.shipPlaced({ placedCoordinates, id });
  };

  const getStateBundles = () =>
    bundleComponentStates({
      initPreviewManager,
      handleShipSelected: view.handleShipSelected,
      handleOrientationToggle: view.handleOrientationToggle,
      processPlacementRequest
    });

  return {
    displayGrid: (container) => view.renderGrid(container),
    initializeSateManagement: () =>
      initializeSateManagement({ id: model.getID(), stateBundles: getStateBundles() })
  };
};
