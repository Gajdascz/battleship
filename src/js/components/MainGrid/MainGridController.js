import { subscribe } from './utility/controllerSubscribers';
import { COMMON_GRID } from '../../utility/constants/components/grids';
import { MOUSE_EVENTS } from '../../utility/constants/events';

export const MainGridController = (mainGridModel, mainGridView) => {
  const _mainGridModel = mainGridModel;
  const _mainGridView = mainGridView;

  const handleShipSelect = (detail) => {
    const { length, orientation } = detail;
    _mainGridView.getElement().addEventListener(MOUSE_EVENTS.OVER, (e) => {
      const targetCoordinates = e.target.closest(COMMON_GRID.CELL_SELECTOR).dataset.coordinates;
      const cells = _mainGridModel.calculateCells(targetCoordinates, length, orientation);
      _mainGridView.displayPlacementPreview(cells);
    });
  };

  const setPlacementState = () => {
    subscribe.shipSelected(_mainGridModel.calculateCells);
  };

  const displayGrid = (container) => _mainGridView.renderGrid(container);

  return { displayGrid };
};
