import { bundleComponentStates } from './utility/bundleComponentStates';
import { initializeSateManagement } from '../../utility/stateManagement/initializeStateManagement';
import { MOUSE_EVENTS } from '../../utility/constants/events';
import { publish } from './utility/publishers';
export const MainGridController = ({ model, view }) => {
  const _model = model;
  const _view = view;

  const initPreviewManager = () => {
    _view.initializePreviewManager({
      maxVertical: _model.getMaxVertical(),
      maxHorizontal: _model.getMaxHorizontal(),
      letterAxis: _model.getLetterAxis()
    });
  };

  const processPlacementRequest = (request) => {
    const { id, length } = request;
    const placedCoordinates = _view.handlePlacementRequest({ shipLength: length, shipID: id });
    if (!placedCoordinates) return;
    publish.shipPlaced({ placedCoordinates, id });
  };

  const getStateBundles = () =>
    bundleComponentStates({
      initPreviewManager,
      handleShipSelected: _view.handleShipSelected,
      handleOrientationToggle: _view.handleOrientationToggle,
      processPlacementRequest
    });

  return {
    displayGrid: (container) => _view.renderGrid(container),
    initializeSateManagement: () =>
      initializeSateManagement({ id: _model.getID(), stateBundles: getStateBundles() })
  };
};
