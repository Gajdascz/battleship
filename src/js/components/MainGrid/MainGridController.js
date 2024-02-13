import { COMMON_GRID } from '../../utility/constants/components/grids';
import { MOUSE_EVENTS, PLACEMENT_EVENTS } from '../../utility/constants/events';
import { STATES } from '../../utility/constants/common';

export const MainGridController = (mainGridModel, mainGridView) => {
  const _model = mainGridModel;
  const _view = mainGridView;

  const handleShipSelect = (detail) => {
    console.log(detail);
    const { id, length, orientation } = detail;
    console.log(id, length, orientation);
    _view.getElement().addEventListener(MOUSE_EVENTS.OVER, (e) => {
      const targetCoordinates = e.target.closest(COMMON_GRID.CELL_SELECTOR).dataset.coordinates;
      const cells = _model.calculateCells(targetCoordinates, length, orientation);
      _view.displayPlacementPreview(cells);
    });
  };

  return {
    displayGrid: (container) => _view.renderGrid(container),
    getPlacementStateData: () => ({
      state: STATES.PLACEMENT,
      fns: {
        execute: [],
        subscribe: [{ event: PLACEMENT_EVENTS.SHIP.SELECTED, callback: handleShipSelect }]
      }
    }),
    getProgressStateData: () => {}
  };
};
